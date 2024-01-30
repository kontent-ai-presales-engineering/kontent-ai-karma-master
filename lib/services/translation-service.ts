import { ContentTypeElements, ContentTypeModels, ContentTypeSnippetModels, ElementModels, LanguageVariantElements, LanguageVariantModels, SharedModels } from "@kontent-ai/management-sdk";
import { SavedValue } from "../../components/custom-elements/translation";
import AzureTranslationService from "./azure-translation-service";
import KontentManagementService from "./kontent-management-service";

export default class TranslationService {
  public kms = new KontentManagementService()
  constructor() { }

  public async startNewTranslation(itemId: string, sourceLanguageId: string, t9nConfig: SavedValue): Promise<void> {
    let workflowID = "0";

    if (sourceLanguageId !== t9nConfig?.sourceLanguageId) {
      // Not the right language to start a translation, abort
      console.log("Not the right language to start a translation, abort")
      return
    }

    const workflow = (await this.kms.getDefaultWorkflow())
    console.log(`Got ${workflow?.steps.length} workflow steps`)

    // 2 - For each language to translate
    const processLanguage = async (targetLanguageId: string) => {
      // 2.1 - Get the variant
      console.log(`Getting variant`)
      let variant = await this.kms.getLanguageVariant(itemId, targetLanguageId)

      // 2.1.1 - If it exists, check if it's published or not
      if (variant) {
        console.log(`Got variant: ${variant.item.codename}`)
        const publishedWorkflowStepId = workflow?.publishedStep.id
        console.log(`Got published WF ID: ${publishedWorkflowStepId}`)

        // 2.1.1.1 - If it's published, create a draft
        if (variant.workflowStep.id === publishedWorkflowStepId) {
          console.log(`variatn is published, creating draft`)
          await this.kms.createDraftOfPublishedItem(variant.item.id as string, variant.language.id as string)
          console.log(`Draft created`)
        }
      } else {
        // 2.1.2 - If it doesn't exist, upsert the language variant
        console.log(`Variant didn't exist, creating`)
        const upsertResult = await this.kms.upsertEmptyLanguageVariant(itemId, targetLanguageId)
        workflowID = (upsertResult._raw as any).workflow.workflow_identifier.id
        console.log(`Empty variant created`)
      }

      // 2.1.3 Change variant to the "translate" step
      const translateWorkflowStep = t9nConfig.triggerWorkflowStep
      workflowID = workflowID == "0" && variant != null  ?  (variant._raw as any).workflow.workflow_identifier.id : workflowID
      this.kms.changeLanguageVariantWorkflowStep(itemId, targetLanguageId, translateWorkflowStep as string, workflowID)
    }

    let targetLanguagesToProcess: any[] = []
    t9nConfig.targetLanguageIds?.forEach(targetLanguageId => {
      targetLanguagesToProcess.push(processLanguage(targetLanguageId))
    })

    await Promise.all(targetLanguagesToProcess)

    // 3 - Change default language to "review translation" step
    const reviewTranslationWorkflowStep = t9nConfig.reviewWorkflowStep
    console.log(`Got review workflow ID: ${reviewTranslationWorkflowStep}, changing default to review step`)
    await this.kms.changeLanguageVariantWorkflowStep(itemId, sourceLanguageId, reviewTranslationWorkflowStep as string, workflowID)
  }

  public async translateLanguageVariant(itemId: string, targetLanguageId: string, t9nConfig: SavedValue): Promise<void> {
    // 2 - If current language is not selected for translation, ignore
    if (t9nConfig?.targetLanguageIds?.findIndex(ltt => ltt === targetLanguageId) === -1) {
      console.log(`Current language not included in the target languages`)
      return
    }

    // 3 - Get the full details for the content item, default content item variant, and content type
    console.log(`Get the full details for the content item, default content item variant, and content type`)
    const getContentTypes = this.kms.getContentTypes()
    const getContentTypeSnippets = this.kms.getContentTypeSnippets()
    const getSourceVariant = this.kms.getLanguageVariant(itemId, t9nConfig.sourceLanguageId as string)
    const getLanguages = this.kms.getLanguages()
    
    const defaultWorkflow = this.kms.getDefaultWorkflow()
    const getWorkflowSteps = (await defaultWorkflow)?.steps
    const [contentTypes, contentTypeSnippets, sourceVariant, languages, workflowSteps] = await Promise.all([getContentTypes, getContentTypeSnippets, getSourceVariant, getLanguages, getWorkflowSteps])

    // 4 - Get the translatable elements and values
    console.log(`Get the translatable elements and values`)
    const [translatableValues, untranslatableValues] = this.getElementValues(contentTypes, contentTypeSnippets, sourceVariant as LanguageVariantModels.ContentItemLanguageWithComponentsVariant)

    // 5 - Perform the actual translation
    console.log(`Perform the actual translation`)
    const azureTranslatorService = new AzureTranslationService()
    const sourceLanguageCodename = languages.find(l => l.id === sourceVariant?.language.id)?.codename
    const targetLanguageCodename = languages.find(l => l.id === targetLanguageId)?.codename
    console.log(`Send to Azure`)
    const translatedValues = await azureTranslatorService.translate(translatableValues, sourceLanguageCodename as string, targetLanguageCodename as string)
    console.log(`Got values from Azure`)

    // 6 - Combine the translated element values with the untranslatable
    const combinedElements = this.combineElements(sourceVariant as LanguageVariantModels.ContentItemLanguageWithComponentsVariant, translatedValues, untranslatableValues)
    console.log('Got combined elements')

    // 7 - Upsert to save the translation
    console.log('Upsert to save the translation')
    await this.kms.upsertLanguageVariant(itemId, targetLanguageId, combinedElements)

    // 8 - Change to the "review translation" step
    console.log('Change to the "review translation" step')
    const reviewTranslationWorkflowStep = t9nConfig.reviewWorkflowStep
    console.log(`Get revew translation step: ${reviewTranslationWorkflowStep}, changing target to it`)
    await this.kms.changeLanguageVariantWorkflowStep(itemId, targetLanguageId, reviewTranslationWorkflowStep as string, (await defaultWorkflow)?.id as string)
    console.log(`Set target to revew translation step`)
  }

  public async handleTranslation({ itemId, language }: { itemId: string, language: string }) {
    console.log("getting translation details")
    const t9nConfig = await this.kms.getTranslationDetails()
    
    const languages = await this.kms.getLanguages()
    const languageId = languages.find(l => l.codename === language)?.id    
    
    if (languageId === t9nConfig?.sourceLanguageId) {
      console.log("starting new translation")
      await this.startNewTranslation(itemId, languageId, t9nConfig)
    } else if (t9nConfig?.targetLanguageIds?.some(tl => tl === languageId)) {
      console.log("starting variant translation")
      await this.translateLanguageVariant(itemId, languageId, t9nConfig)
    }
  }

  private getElementValues(contentTypes: ContentTypeModels.ContentType[], contentTypeSnippets: ContentTypeSnippetModels.ContentTypeSnippet[], sourceVariant: LanguageVariantModels.ContentItemLanguageWithComponentsVariant) {
    const allSupportedElementDefinitions = [
      ...contentTypes.flatMap(ct => ct.elements.filter(e => e.type === "text" || e.type === "rich_text")),
      ...contentTypeSnippets.flatMap(cts => cts.elements.filter(e => e.type === "text" || e.type === "rich_text"))
    ]

    const translatableValues = this.getComponentValues(sourceVariant?.item?.id as string, sourceVariant.elements, allSupportedElementDefinitions)

    const allOtherElementDefinitions = [
      ...contentTypes.flatMap(ct => ct.elements.filter(e => e.type !== "text" && e.type !== "rich_text")),
      ...contentTypeSnippets.flatMap(cts => cts.elements.filter(e => e.type !== "text" && e.type !== "rich_text"))
    ]

    const untranslatableValues = this.getComponentValues(sourceVariant.item.id as string, sourceVariant.elements, allOtherElementDefinitions)
    return [translatableValues, untranslatableValues]
  }

  private getComponentValues(itemId: string, parentElements: ElementModels.ContentItemElement[], allSupportedElementDefinitions: ContentTypeElements.ContentTypeElementModel[]): Array<valueTranslationMap> {
    const parentElementsSupported = parentElements.filter(e => allSupportedElementDefinitions.findIndex(eot => e.element.id === eot.id) > -1)

    return parentElementsSupported.flatMap(parentElement => {
      const ownValue: valueTranslationMap = {
        itemId,
        elementId: parentElement.element.id as string,
        value: parentElement.value
      }

      // If the element has components, get their values
      if (parentElement.components) {
        const componentValues = parentElement.components.flatMap(component => this.getComponentValues(component.id, component.elements, allSupportedElementDefinitions))
        return [ownValue, ...componentValues]
      }

      return ownValue
    })
  }

  private setComponentValues(itemId: string, components: Array<ElementModels.ContentItemElementComponent>, values: Array<valueTranslationMap>): Array<ElementModels.ContentItemElementComponent> {

    const updatedComponents = components

    updatedComponents.forEach(updatedComponent => {
      updatedComponent.elements.forEach(updatedElement => {
        const value = values.find(v => (v.itemId === updatedComponent.id && v.elementId === updatedElement.element.id))?.value

        if (value) {
          if (updatedElement.components) {
            updatedElement.components = this.setComponentValues(itemId, updatedElement.components, values)
          }
          updatedElement.value = value
        }
      })
    })

    return updatedComponents
  }

  private combineElements(
    sourceVariant: LanguageVariantModels.ContentItemLanguageWithComponentsVariant,
    translatedValues: Array<valueTranslationMap>,
    untranslatableValues: Array<valueTranslationMap>
  ): Array<LanguageVariantElements.ILanguageVariantElementBase> {
    const values = [...translatedValues, ...untranslatableValues];
  
    const combinedElements = sourceVariant.elements
      .map(e => {
        // Find the value for the current element
        const valueEntry = values.find(v => v.itemId === sourceVariant.item.id && v.elementId === e.element.id);
        const value = valueEntry?.value;
  
        // If a value is found and it's not an empty string or "<p><br/></p>", include it in the result
        if (value && value.toString() !== '' && value.toString() !== "<p><br/></p>") {
          if (e.components) {
            e.components = this.setComponentValues(sourceVariant.item.id as string, e.components, values);
          }
          return {
            ...e,
            value: value // Set the found value
          } as LanguageVariantElements.ILanguageVariantElementBase;
        } else if (value === undefined) {
          // If no value is found, skip this element by returning undefined
          return undefined;
        }
        // If value is an empty string or "<p><br/></p>", return the element without changes
        return e;
      })
      .filter(e => e !== undefined) // Remove undefined elements from the result
      .filter(e => e.value?.toString() !== '' && e.value?.toString() !== "<p><br/></p>"); // Further filter elements based on value
  
    // Return the array of ILanguageVariantElementBase
    return combinedElements as Array<LanguageVariantElements.ILanguageVariantElementBase>;
  }
}
export interface valueTranslationMap {
  itemId: string,
  elementId: string,
  value: string | number | SharedModels.ReferenceObject[];
}