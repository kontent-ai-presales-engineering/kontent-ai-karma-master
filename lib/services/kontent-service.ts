import { DeliveryError, IContentItem } from '@kontent-ai/delivery-sdk';
import { siteCodename } from '../utils/env';
import { Article, contentTypes, Product, WSL_WebSpotlightRoot, RobotsTxt, SEOMetadata, Event, WSL_Page } from '../../models';
import { PerCollectionCodenames } from '../routing';
import { deliveryClient } from './kontentClient';
import { ArticlePageSize, EventPageSize, ProductsPageSize } from '../constants/paging';

export const getItemByCodename = <ItemType extends IContentItem>(codename: PerCollectionCodenames, usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  const itemCodename = codename[siteCodename];

  if (itemCodename === null) {
    return Promise.resolve(null);
  }

  return deliveryClient
    .item(itemCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(10)
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

export const getItemByUrlSlug = <ItemType extends IContentItem>(url: string, elementCodename: string = "url", usePreview: boolean, languageCodename: string): Promise<ItemType | null> => {
  return deliveryClient
    .items()
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(10)
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

export const getHomepage = (usePreview: boolean, languageCodename: string) =>
  deliveryClient
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as WSL_WebSpotlightRoot)

const robotsTypeCodename = "robots_txt" as const;

export const getRobotsTxt = (usePreview: boolean) =>
  deliveryClient
    .items()
    .type(robotsTypeCodename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .depthParameter(0)
    .toPromise()
    .then(res => res.data.items[0] as RobotsTxt | undefined)

export const getProductsForListing = (usePreview: boolean, languageCodename: string, page?: number, categories?: string[], pageSize: number = ProductsPageSize) => {
  const query = deliveryClient
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

export const getProductSlugs = () =>
  deliveryClient
    .items<Product>()
    .type(contentTypes.product.codename)
    .collection(siteCodename)
    .elementsParameter([contentTypes.product.elements.url.codename])
    .toAllPromise()
    .then(res => res.data.items);

export const getProductDetail = (slug: string, usePreview: boolean, languageCodename: string) =>
  deliveryClient
    .items<Product>()
    .equalsFilter(`elements.${contentTypes.product.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getArticlesForListing = (usePreview: boolean, languageCodename: string, page?: number, articleType?: string[], pageSize: number = ArticlePageSize) => {
  const query = deliveryClient
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
    query.inFilter(`elements.${contentTypes.article.elements.article_type.codename}`, articleType)
  }

  query.includeTotalCountParameter();

  return query
    .toPromise()
    .then(res => res.data);
}

export const getEventsForListing = (usePreview: boolean, languageCodename: string, page?: number, eventType?: string[], pageSize: number = EventPageSize) => {
  const query = deliveryClient
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

  query.includeTotalCountParameter();

  return query
    .toPromise()
    .then(res => res.data);
}

export const getAllPages = (usePreview: boolean) =>
  deliveryClient
    .items<WSL_Page>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getAllEvents = (usePreview: boolean) =>
  deliveryClient
    .items<Event>()
    .type(contentTypes.event.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getEventBySlug = (slug: string, usePreview: boolean, languageCodename: string) =>
  deliveryClient
    .items<Event>()
    .equalsFilter(`elements.${contentTypes.event.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .depthParameter(10)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

export const getAllArticles = (usePreview: boolean) =>
  deliveryClient
    .items<Article>()
    .type(contentTypes.article.codename)
    .collection(siteCodename)
    .queryConfig({
      usePreviewMode: usePreview
    })
    .toPromise()
    .then(res => res.data);

export const getArticleBySlug = (slug: string, usePreview: boolean, languageCodename: string) =>
  deliveryClient
    .items<Article>()
    .equalsFilter(`elements.${contentTypes.article.elements.url.codename}`, slug)
    .languageParameter(languageCodename)
    .depthParameter(10)
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toAllPromise()
    .then(res => res.data.items[0]);

const getCurrentCollectionTotalCountQuery = () => (
  deliveryClient
    .items()
    .collection(siteCodename)
    .elementsParameter([])
    .limitParameter(1)
    .includeTotalCountParameter()
);

const getItemsCountByTypeQuery = (usePreview: boolean, languageCodename?: string, contentTypeCodename?: string) => {
  const query = getCurrentCollectionTotalCountQuery()
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

export const getItemsTotalCount = (usePreview: boolean, languageCodename: string, contentTypeCodename?: string) => {
  const query = getItemsCountByTypeQuery(usePreview, languageCodename, contentTypeCodename);

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount)
}

export const getArticlesCountByCategory = (usePreview: boolean, articleType: string, languageCodename?: string) => {
  const query = getItemsCountByTypeQuery(usePreview, languageCodename, contentTypes.article.codename);

  if (articleType !== 'all') {
    query.containsFilter(`elements.${contentTypes.article.elements.article_type.codename}`, [articleType])
  }

  return query
    .toPromise()
    .then(res => res.data.pagination.totalCount || 0)
}

export const getItemsCount = (usePreview: boolean, contentTypeCodename?: string) => {
  const query = deliveryClient
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

export const getArticleTaxonomy = async (usePreview: boolean) =>
  deliveryClient
    .taxonomy("article_type")
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getProductTaxonomy = async (usePreview: boolean) =>
  deliveryClient
    .taxonomy("product_category")
    .queryConfig({
      usePreviewMode: usePreview,
    })
    .toPromise()
    .then(res => res.data.taxonomy.terms);

export const getDefaultMetadata = async (usePreview: boolean, languageCodename: string) =>
  deliveryClient
    .items()
    .type(homepageTypeCodename)
    .collection(siteCodename)
    .languageParameter(languageCodename)
    .queryConfig({
      usePreviewMode: usePreview,
      waitForLoadingNewContent: usePreview
    })
    .elementsParameter(["seo_metadata__title", "seo_metadata__description", "seo_metadata__keywords"])
    .depthParameter(10)
    .toPromise()
    .then(res => res.data.items[0] as SEOMetadata)