import { DeliveryError, IContentItem, camelCasePropertyNameResolver, createDeliveryClient } from '@kontent-ai/delivery-sdk';
import { defaultEnvId, defaultPreviewKey, deliveryApiDomain, deliveryPreviewApiDomain, siteCodename } from '../utils/env';
import { contentTypes, Page, ImageContainer } from '../../models';
const sourceTrackingHeaderName = 'X-KC-SOURCE';
const defaultDepth = 10;

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) => createDeliveryClient({
  retryStrategy: {
    canRetryError: (error) => {
      return true; // retries all the errors - not effficient but does the job
    },
    maxAttempts: 5
  },
  environmentId: envId,
  globalHeaders: () => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    }
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: deliveryApiDomain,
    basePreviewUrl: deliveryPreviewApiDomain,
  },
  previewApiKey: defaultEnvId === envId ? defaultPreviewKey : previewApiKey
});

type ClientConfig = {
  envId: string,
  previewApiKey?: string
}

export const getItemByCodename = <ItemType extends IContentItem>(config: ClientConfig, codename: string, usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .item(codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .languageParameter(languageCodename)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.item as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getItemById = <ItemType extends IContentItem>(config: ClientConfig, id: string, usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .limitParameter(1)
    .languageParameter(languageCodename)
    .equalsFilter(`system.id`, id)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.items[0] as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getItemVariantById = <ItemType extends IContentItem>(config: ClientConfig, id: string, usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(0)
    .limitParameter(1)
    .languageParameter(languageCodename)
    .equalsFilter('system.language', languageCodename)
    .equalsFilter(`system.id`, id)
    .toPromise()
    .then(res => {
      if (res.response.status === 404 || res.data.items.length === 0) {
        return null;
      }
      return res.data.items[0] as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getItemByUrlSlug = <ItemType extends IContentItem>(config: ClientConfig, url: string, elementCodename: string = "url", usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .limitParameter(1)
    // .languageParameter(languageCodename)
    .equalsFilter(`elements.${elementCodename}`, url)
    .toPromise()
    .then(res => {
      if (res.response.status === 404) {
        return null;
      }
      return res.data.items[0] as ItemType
    })
    .catch((error) => {
      debugger;
      if (error instanceof DeliveryError) {
        // delivery specific error (e.g. item with codename not found...)
        console.error(error.message, error.errorCode);
        return null;
      } else {
        // some other error
        console.error("HTTP request error", error);
        // throw error;
        return null;
      }
    });
}

export const getContentType = (config: ClientConfig, contentType: string) =>
  getDeliveryClient(config)
    .type(contentType)
    .toPromise()

export const getAllItemByType = <T extends IContentItem>(config: ClientConfig, usePreview: boolean, type: string, languageCodename: string) =>
  getDeliveryClient(config)
    .items<T>()
    .type(type)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toAllPromise()
    .then(response => response.data.items);

export const getItemBySlug = async <T extends IContentItem>(config: ClientConfig, slug: string, type: string, usePreview: boolean = false, languageCodename: string): Promise<T | null> => {
  const items = await getDeliveryClient(config)
    .items<T>()
    .equalsFilter("elements.url", slug)
    .type(type)
    .languageParameter(languageCodename)
    .collections([siteCodename, "default"])
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toAllPromise()
    .then(response => response.data.items);

  if ((items).length === 0) {
    console.warn(`Could not find item with URL slug "${slug}" of type "${type}"`);
    return null;
  }

  if (items.length > 1) {
    console.warn(`Found more then one items with URL slug "${slug}" of type "${type} - found ${items.length} items. Using the first one.`)
  }

  const item = items[0];
  if (!item) {
    throw Error(`Item by URL slug "${slug}" of type "${type} nof found`);
  }
  return item;
}

export const getAllBanners = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<ImageContainer>()
    .type(contentTypes.image_container.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getBannerBySlug = (config: ClientConfig, slug: string, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items<ImageContainer>()
    .equalsFilter(`system.codename`, slug)
    .languageParameter(languageCodename)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

const getCurrentCollectionTotalCountQuery = (config: ClientConfig) => (
  getDeliveryClient(config)
    .items()
    .collection(siteCodename)
    .elementsParameter([])
    .limitParameter(1)
    .includeTotalCountParameter()
);

const getItemsCountByTypeQuery = (config: ClientConfig, usePreview: boolean, languageCodename?: string, contentTypeCodename?: string) => {
  const query = getCurrentCollectionTotalCountQuery(config)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
  if (languageCodename) {
    query.languageParameter(languageCodename)
  }
  if (contentTypeCodename) {
    query.type(contentTypeCodename);
  }
  return query;
}

export const getItemsTotalCount = (config: ClientConfig, usePreview: boolean, languageCodename: string, contentTypeCodename?: string) => {
  const query = getItemsCountByTypeQuery(config, usePreview, languageCodename, contentTypeCodename);

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount)
}

export const getItemsCount = (config: ClientConfig, usePreview: boolean, contentTypeCodename?: string) => {
  const query = getDeliveryClient(config)
    .items()
    .collection(siteCodename)
    .elementsParameter([])
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .limitParameter(1)
    .includeTotalCountParameter();

  if (contentTypeCodename) {
    query.type(contentTypeCodename);
  }

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount)
}

export const getPagesSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Page>()
    .type(contentTypes.page.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.page.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items.map(item => item.elements.url.value));