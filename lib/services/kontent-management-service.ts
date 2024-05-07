import { LanguageVariantElements, LanguageVariantModels, LanguageVariantResponses, ManagementClient } from "@kontent-ai/management-sdk";
import { getItemVariantById } from './kontentClient';

type ClientConfig = {
  envId: string,
  previewApiKey?: string
}

export default class KontentManagementService {
  public readonly defaultLanguageId = '00000000-0000-0000-0000-000000000000'
  constructor() {
  }

  public static createKontentManagementClient() {
    return new ManagementClient({
      environmentId: process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string,
      retryStrategy: {
        canRetryError: (error) => {
          return true; // retries all the errors - not effficient but does the job
        },
        maxAttempts: 5
      },      
    });
  }

  public async getContentItemById(itemId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.viewContentItem().byItemId(itemId).toPromise()
    return response.data
  }

  public async getContentType(contentTypeId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.viewContentType().byTypeId(contentTypeId).toPromise()
    return response.data
  }

  public async getContentTypeByName(contentTypeCodename: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.viewContentType().byTypeCodename(contentTypeCodename).toPromise()
    return response.data
  }

  public async getContentTypes() {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.listContentTypes().toAllPromise()
    return response.data.items
  }

  public async getContentTypeSnippets() {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.listContentTypeSnippets().toAllPromise()
    return response.data.items
  }

  public async getLanguageVariant(contentItemId: string, languageId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    try {
      const clientResponse: LanguageVariantResponses.ViewLanguageVariantResponse = await client
        .viewLanguageVariant()
        .byItemId(contentItemId)
        .byLanguageId(languageId)
        .toPromise()

      return new LanguageVariantModels.ContentItemLanguageWithComponentsVariant({
        ...clientResponse.data,
        elements: clientResponse.data.elements.map(e => ({ ...e, value: e.value ?? "", components: (e._raw as any).components })),
        rawElements: clientResponse.rawData.elements
      })
    } catch {
      return null
    }
  }

  public async getDefaultWorkflow() {
    console.log("getDefaultWorkflow")
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.listWorkflows().toPromise()
    return response.data.find(e => e.codename === "default")
  }

  public async getLanguages() {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.listLanguages().toPromise()
    return response.data.items
  }

  public async getLanguageVariantsOfItem(config: ClientConfig, contentItemId: string, isPreview: boolean) {
    const languages = await this.getLanguages()
    // Assuming getLanguageVariant is an async function that retrieves the language variant
    const variants = (await Promise.all(
      languages.map(async (language) => {
        const item = await getItemVariantById(config, contentItemId, isPreview, language.codename);
        return item;
      })
    )).filter(item => item !== null);
    return variants; // This will be an array of all language variants for the content item
  }

  public async createDraftOfPublishedItem(contentItemId: string, languageId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    await client.createNewVersionOfLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageId(languageId)
      .toPromise()
  }

  public async createContentItem(contentItemName: string, contentTypeCodename: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client
      .addContentItem()
      .withData({
        name: contentItemName,
        type: {
          codename: contentTypeCodename
        },
        collection: {
          codename: 'sandbox'
        }
      })
      .toPromise()
    return response.data
  }

  public async updateContentItem(contentItemName: string, contentItemId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client
      .updateContentItem()
      .byItemId(contentItemId)
      .withData({
        name: contentItemName
      })
      .toPromise()
    return response.data
  }

  public async upsertEmptyLanguageVariant(contentItemId: string, languageId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client
      .upsertLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageId(languageId)
      .withData((builder) => {
        return {
          elements: []
        }
      })
      .toPromise()
    return response.data
  }

  public async unpublishLanguageVariant(contentItemId: string, languageId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .unpublishLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageId(languageId)
      .withoutData()
      .toPromise()
  }

  public async changeLanguageVariantWorkflowStep(contentItemId: string, languageId: string, workflowStep: string, workflowId: string) {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .changeWorkflowOfLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageId(languageId)
      .withData({
        workflow_identifier: {
          id: workflowId
        },
        step_identifier: {
          codename: workflowStep
        }
      })
      .toPromise()
  }

  public async changeLanguageVariantWorkflowStepByLanguageCodename(contentItemId: string, languageCodename: string, workflowStep: string, workflowId: string,) {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .changeWorkflowOfLanguageVariant()
      .byItemId(contentItemId)
      .byLanguageCodename(languageCodename)
      .withData({
        workflow_identifier: {
          id: workflowId
        },
        step_identifier: {
          codename: workflowStep
        }
      })
      .toPromise()
  }

  public async upsertLanguageVariant(itemId: string, languageId: string, elements: LanguageVariantElements.ILanguageVariantElementBase[]): Promise<void> {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .upsertLanguageVariant()
      .byItemId(itemId)
      .byLanguageId(languageId)
      .withData((builder) => {
        return {
          elements: elements
        }
      })
      .toPromise()
  }

  public async createNewVersionOfLanguageVariant(itemId: string, languageId: string): Promise<void> {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .createNewVersionOfLanguageVariant()
      .byItemId(itemId)
      .byLanguageId(languageId)
      .toPromise()
  }

  public async upsertLanguageContentVariant(itemId: string, languageId: string, elements: any): Promise<void> {
    const client = KontentManagementService.createKontentManagementClient()
    await client
      .upsertLanguageVariant()
      .byItemId(itemId)
      .byLanguageId(!languageId ? "00000000-0000-0000-0000-000000000000" : languageId)
      .withData(elements)
      .toPromise()
  }

  public async upsertLanguageVariantTextElement(itemId: string, languageCodename: string, element: string, value: string) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client
      .upsertLanguageVariant()
      .byItemId(itemId)
      .byLanguageCodename(languageCodename)
      .withData((builder) => {
        return {
          elements: [
            builder.textElement({
              element: {
                codename: element
              },
              value: value
            })
          ]
        }
      })
      .toPromise();

    return response.data;
  }
}