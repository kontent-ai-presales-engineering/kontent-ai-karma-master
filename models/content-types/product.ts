import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type ProductCategory } from '../taxonomies/productCategory';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Product
 * Id: 61076605-f6fc-4aa6-8bca-e59e8d5818b7
 * Codename: product
 */
export type Product = IContentItem<{
  /**
   * Body (rich_text)
   * Required: false
   * Id: 8b747f72-ac96-4d45-a239-d246ddb265a2
   * Codename: body
   */
  body: Elements.RichTextElement;

  /**
   * Description (rich_text)
   * Required: false
   * Id: 8a4ad010-b8fd-43aa-a65d-7ae0f1afc4dd
   * Codename: description
   */
  description: Elements.RichTextElement;

  /**
   * Model (text)
   * Required: false
   * Id: 9cc64acf-d32e-4243-9007-7d5beebc264f
   * Codename: model
   */
  model: Elements.TextElement;

  /**
   * Price (number)
   * Required: false
   * Id: 7d5b0527-6c36-40d9-9c4f-08449795f6ee
   * Codename: price
   */
  price: Elements.NumberElement;

  /**
   * Product category (taxonomy)
   * Required: false
   * Id: 7f023711-55b5-4c4f-ae39-94bf293196e6
   * Codename: product_category
   */
  productCategory: Elements.TaxonomyElement<ProductCategory>;

  /**
   * Product image (asset)
   * Required: false
   * Id: 878ff553-7c5b-445e-b2d7-dcf74c181c2e
   * Codename: product_image
   */
  productImage: Elements.AssetsElement;

  /**
   * SKU (text)
   * Required: false
   * Id: 86ab095a-08e6-44ec-9b40-9b8091e04490
   * Codename: sku
   */
  sku: Elements.TextElement;

  /**
   * Title (text)
   * Required: false
   * Id: 5ee48a99-a96d-48be-8f15-1616bfb357ba
   * Codename: title
   */
  title: Elements.TextElement;

  /**
   * Slug (url_slug)
   * Required: false
   * Id: c817e53e-c910-49ff-a1e8-5200654bd0e2
   * Codename: url
   */
  url: Elements.UrlSlugElement;
}> &
  OpenGraphMetadata &
  SEOMetadata;
