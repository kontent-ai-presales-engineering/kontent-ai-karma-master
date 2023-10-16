import { collections } from './../../models/project/collections';
import { roles } from './../../models/project/roles';
import { LanguageVariantElements, LanguageVariantModels, LanguageVariantResponses, ManagementClient } from "@kontent-ai/management-sdk";
import { SavedValue } from "../../components/custom-elements/translation";
import { contentTypes } from '../../models';

export default class KontentManagementService {
  public readonly defaultLanguageId = '00000000-0000-0000-0000-000000000000'
  constructor() {
  }

  public static createKontentManagementClient() {
    return new ManagementClient({
      environmentId: process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
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

  public async getRole(environmentId: string, roleCodename: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.viewRole().byCodename(roleCodename).toPromise()
    return response.data
  }

  public async getRoleIdByName(environmentId: string, roleName: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.listRoles().toPromise()
    const roleId = response.data.roles.filter(role => role.name === roleName)[0]?.id
    return roleId
  }

  public async inviteUser(environmentId: string, email: string, roleId: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const responseCollections = await client.listCollections().toPromise()
    const collections = responseCollections.data.collections.map((collection) => {
      return {
        id: collection.id
      }
    });
    const responseLanguages = await client.listLanguages().toPromise()
    const languages = responseLanguages.data.items.map((lang) => {
      return {
        id: lang.id
      }
    });
    const response = await client.inviteUser().withData(
      {
        "email": email,
        "collection_groups": [
          {
            collections,
            "roles": [
              {
                "id": roleId,
                languages,
              }
            ]
          }
        ]
      }).toPromise()
    return response.data
  }

  public async getEnvironmentCloningState(environmentId: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.getEnvironmentCloningState().toPromise()
    return response.data
  }

  public async cloneEnvironment(environmentName: string, rolesToActivate: string[]) {
    const client = KontentManagementService.createKontentManagementClient()
    const response = await client.cloneEnvironment().withData(
      {
        name: environmentName,
        roles_to_activate: rolesToActivate
      }
    ).toPromise()
    return response.data
  }

  public async removeEnvironment(environmentId: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.deleteEnvironment().toPromise()
    return response.data
  }

  public async getSpace(environmentId: string, spaceName: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.viewSpace().bySpaceCodename(spaceName).toPromise()
    return response.data
  }

  public async updatePreviewUrls(environmentId: string, spaceId: string, domainUrl: string) {
    const client = new ManagementClient({
      environmentId: environmentId,
      apiKey: process.env.KONTENT_MANAGEMENT_API_KEY as string
    });
    const response = await client.modifyPreviewConfiguration().withData(
      {
        "space_domains": [
          {
            "space": {
              "id": spaceId
            },
            "domain": domainUrl
          }
        ],
        "preview_url_patterns": [
          {
            "content_type": {
              "id": contentTypes.web_spotlight_root.id
            },
            "url_patterns": [
              {
                "space": {
                  "id": spaceId
                },
                "url_pattern": `https://{Space}/${environmentId}/api/preview?secret=mySuperSecret&slug=/&type=${contentTypes.web_spotlight_root.codename}&lang={Lang}`
              }
            ]
          },
          {
            "content_type": {
              "id": contentTypes.page.id
            },
            "url_patterns": [
              {
                "space": {
                  "id": spaceId
                },
                "url_pattern": `https://{Space}/${environmentId}/api/preview?secret=mySuperSecret&lug={URLslug}&type=${contentTypes.page.codename}&lang={Lang}`
              }
            ]
          },
          {
            "content_type": {
              "id": contentTypes.article.id
            },
            "url_patterns": [
              {
                "space": {
                  "id": spaceId
                },
                "url_pattern": `https://{Space}/${environmentId}/api/preview?secret=mySuperSecret&slug={URLslug}&type=${contentTypes.article.codename}&lang={Lang}`
              }
            ]
          },
          {
            "content_type": {
              "id": contentTypes.product.id
            },
            "url_patterns": [
              {
                "space": {
                  "id": spaceId
                },
                "url_pattern": `https://{Space}/${environmentId}/api/preview?secret=mySuperSecret&slug={URLslug}&type=${contentTypes.product.codename}&lang={Lang}`
              }
            ]
          }
        ]
      }).toPromise()
    return response.data
  }


  public async getTranslationDetails() {
    const client = KontentManagementService.createKontentManagementClient()
    try {
      console.log(`Getting element ID for translation via: ${client.viewContentType().byTypeCodename('site_configuration').getUrl()}`)

      try {
        const contentTypeResponse = await client
          .viewContentType()
          .byTypeCodename('site_configuration')
          .toPromise()
        console.log(`Got content type for configuration: ${JSON.stringify(contentTypeResponse.rawData)}`)
        const elementId = contentTypeResponse.data.elements.find(e => e.type === "custom" && e.codename === "translation")?.id
        console.log(`Element ID: ${elementId}`)

        console.log(`Getting configuration details`)
        const response = await client
          .viewLanguageVariant()
          .byItemCodename(process.env.NEXT_PUBLIC_KONTENT_PROJECT_CONFIG_CODENAME as string)
          .byLanguageId(this.defaultLanguageId)
          .toPromise()

        console.log(`Got configuration details, getting config data`)
        const valueRaw = response.data.elements.find(e => e.element.id === elementId)?.value
        console.log(`Parsing and sending back config data`)
        return valueRaw ? JSON.parse(valueRaw as string) as SavedValue : null
      } catch (error) {
        console.log(error)
      }
    } catch (e) {
      console.log(e)
    }
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
        }
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

  public async changeLanguageVariantWorkflowStep(contentItemId: string, languageId: string, workflowStepId: string, workflowId: string) {
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
          id: workflowStepId
        }
      })
      .toPromise()
  }

  public async changeLanguageVariantWorkflowStepByLanguageCodename(contentItemId: string, languageCodename: string, workflowStepId: string, workflowId: string,) {
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
          id: workflowStepId
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