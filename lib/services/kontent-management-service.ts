import { LanguageVariantModels, LanguageVariantResponses, ManagementClient } from "@kontent-ai/management-sdk";

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
}