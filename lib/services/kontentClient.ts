import { Channels } from './../../models/taxonomies/channels';
import { DeliveryError, IContentItem, camelCasePropertyNameResolver, createDeliveryClient } from '@kontent-ai/delivery-sdk';
import { defaultEnvId, defaultPreviewKey, deliveryApiDomain, deliveryPreviewApiDomain, siteCodename } from '../utils/env';
import { Article, contentTypes, Product, WSL_WebSpotlightRoot, RobotsTxt, SEOMetadata, Event, WSL_Page, Course, ImageContainer, taxonomies } from '../../models';
import { ArticlePageSize, EventPageSize, ProductsPageSize } from '../constants/paging';
const sourceTrackingHeaderName = 'X-KC-SOURCE';
const defaultDepth = 10;

const getDeliveryClient = ({ envId, previewApiKey }: ClientConfig) => createDeliveryClient({
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

export const getItemByUrlSlug = <ItemType extends IContentItem>(config: ClientConfig, url: string, elementCodename: string = "url", usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return getDeliveryClient(config)
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(defaultDepth)
    .limitParameter(1)
    .languageParameter(languageCodename)
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

const homepageTypeCodename = "web_spotlight_root" as const;

export const getHomepage = (config: ClientConfig, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => res.data.items[0] as WSL_WebSpotlightRoot)

const robotsTypeCodename = "robots_txt" as const;

export const getRobotsTxt = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items()
    .type(robotsTypeCodename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(0)
    .toPromise()
    .then(res => res.data.items[0] as RobotsTxt | undefined)

export const getCourseDetail = (config: ClientConfig, slug: string, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items<Course>()
    .equalsFilter(`elements.${contentTypes.course.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getCourseItemsWithSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Course>()
    .type(contentTypes.course.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.course.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getCoursesForListing = (config: ClientConfig, usePreview: boolean, languageCodename: string, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = getDeliveryClient(config)
    .items<Course>()
    .type(contentTypes.course.codename)
    .languageParameter(languageCodename)
    .elementsParameter([
      contentTypes.course.elements.title.codename,
      contentTypes.course.elements.hero_image.codename,
      contentTypes.course.elements.url.codename,
      contentTypes.course.elements.course_category.codename,
      contentTypes.course.elements.fee_in__.codename,
    ])
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .includeTotalCountParameter()
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  };

  if (categories && categories[0].length > 0 && categories[0] !== 'all') {
    query.anyFilter(`elements.${contentTypes.course.elements.course_category.codename}`, categories);
  }

  return query
    .toPromise()
    .then(res => res.data);
}


export const getProductsForListing = (config: ClientConfig, usePreview: boolean, languageCodename: string, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = getDeliveryClient(config)
    .items<Product>()
    .type(contentTypes.product.codename)
    .languageParameter(languageCodename)
    .elementsParameter([
      contentTypes.product.elements.title.codename,
      contentTypes.product.elements.product_image.codename,
      contentTypes.product.elements.url.codename,
      contentTypes.product.elements.product_category.codename,
      contentTypes.product.elements.price.codename,
    ])
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .includeTotalCountParameter()
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  };

  if (categories && categories[0].length > 0 && categories[0] !== 'all') {
    query.anyFilter(`elements.${contentTypes.product.elements.product_category.codename}`, categories);
  }

  return query
    .toPromise()
    .then(res => res.data);
}

export const getLanguages = (config: ClientConfig) =>
  getDeliveryClient(config)
    .languages()
    .toPromise()

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

export const getProductItemsWithSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Product>()
    .type(contentTypes.product.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.product.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getProductBySku = (config: ClientConfig, sku: string, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Product>()
    .type(contentTypes.product.codename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .equalsFilter(`elements.${contentTypes.product.elements.sku.codename}`, sku)
    .depthParameter(defaultDepth)
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getEventItemsWithSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<Event>()
    .type(contentTypes.product.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.product.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items)

export const getProductDetail = (config: ClientConfig, slug: string, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items<Product>()
    .equalsFilter(`elements.${contentTypes.product.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getArticlesForListing = (config: ClientConfig, usePreview: boolean, languageCodename: string, page?: number, articleType?: string[], pageSize: number = ArticlePageSize) => {
  const query = getDeliveryClient(config)
    .items<Article>()
    .type(contentTypes.article.codename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  };

  if (articleType && articleType[0].length > 0 && articleType[0] !== 'all') {
    query.anyFilter(`elements.${contentTypes.article.elements.article_type.codename}`, articleType)
  }

  query.includeTotalCountParameter();

  return query
    .toPromise()
    .then(res => res.data);
}

export const getEventsForListing = (config: ClientConfig, usePreview: boolean, languageCodename: string, page?: number, eventType?: string[], channel?: string[], pageSize: number = EventPageSize) => {
  const query = getDeliveryClient(config)
    .items<Event>()
    .type(contentTypes.event.codename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .limitParameter(pageSize)

  if (page) {
    query.skipParameter((page - 1) * pageSize)
  };

  if (eventType && eventType[0].length > 0) {
    query.anyFilter(`elements.${contentTypes.event.elements.event_type.codename}`, eventType)
  }

  if (channel && channel[0].length > 0) {
    query.anyFilter(`elements.${contentTypes.event.elements.channels.codename}`, channel)
  }

  query.includeTotalCountParameter();

  return query
    .toPromise()
    .then(res => res.data);
}

export const getAllPages = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<WSL_Page>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getAllEvents = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Event>()
    .type(contentTypes.event.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

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

export const getEventBySlug = (config: ClientConfig, slug: string, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items<Event>()
    .equalsFilter(`elements.${contentTypes.event.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getAllArticles = (config: ClientConfig, usePreview: boolean) =>
  getDeliveryClient(config)
    .items<Article>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getArticleBySlug = (config: ClientConfig, slug: string, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items<Article>()
    .equalsFilter(`elements.${contentTypes.article.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .depthParameter(defaultDepth)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

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

export const getArticlesCountByCategory = (config: ClientConfig, usePreview: boolean, articleType: string, languageCodename?: string) => {
  const query = getItemsCountByTypeQuery(config, usePreview, languageCodename, contentTypes.article.codename);

  if (articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.article_type.codename}`, [articleType])
  }

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount || 0)
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

export const getArticleTaxonomy = async (config: ClientConfig) =>
  getDeliveryClient(config)
    .taxonomy(taxonomies.article_type.codename)
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getProductTaxonomy = async (config: ClientConfig) =>
  getDeliveryClient(config)
    .taxonomy(taxonomies.product_category.codename)
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getPersonas = async (config: ClientConfig) =>
  getDeliveryClient(config)
    .taxonomy(taxonomies.personas.codename)
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getCourseTaxonomy = async (config: ClientConfig) =>
  getDeliveryClient(config)
    .taxonomy(taxonomies.course_category.codename)
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getDefaultMetadata = async (config: ClientConfig, usePreview: boolean, languageCodename: string) =>
  getDeliveryClient(config)
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .elementsParameter([contentTypes.page.elements.seo_metadata__title.codename, contentTypes.page.elements.seo_metadata__description.codename, contentTypes.page.elements.seo_metadata__keywords.codename])
    .depthParameter(defaultDepth)
    .toPromise()
    .then(res => res.data.items[0] as SEOMetadata)

export const getPagesSlugs = (config: ClientConfig) =>
  getDeliveryClient(config)
    .items<WSL_Page>()
    .type(contentTypes.page.codename)
    .collections([siteCodename, "default"])
    .elementsParameter([contentTypes.page.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items.map(item => item.elements.url.value));