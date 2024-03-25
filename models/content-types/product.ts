import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Channels } from '../taxonomies/channels';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type ProductCategory } from '../taxonomies/productCategory';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * Product
 * Id: 62fcbb78-ab65-4247-99cc-e29bb789133d
 * Codename: product
 */
export type Product = IContentItem<{
    /**
     * Body (rich_text)
     * Required: false
     * Id: 10e3b6eb-79f4-48d9-8b73-e8d7b6ccf9f0
     * Codename: body
     */
    body: Elements.RichTextElement;

    /**
     * Channels (taxonomy)
     * Required: false
     * Id: 8b555b23-055c-4cd1-91fc-016e53f87146
     * Codename: channel
     */
    channel: Elements.TaxonomyElement<Channels>;

    /**
     * Description (rich_text)
     * Required: false
     * Id: 59322205-f074-402c-9871-334cdcf5c4e1
     * Codename: description
     */
    description: Elements.RichTextElement;

    /**
     * entityId (custom)
     * Required: false
     * Id: d182f261-6ddb-498a-851f-20527425e686
     * Codename: entityid
     */
    entityid: Elements.CustomElement;

    /**
     * Model (text)
     * Required: false
     * Id: 822ab7f4-abe0-44e5-b48d-e463d9a5bc97
     * Codename: model
     */
    model: Elements.TextElement;

    /**
     * Images (custom)
     * Required: false
     * Id: 336378f3-8aab-4ac8-9e61-1e76a78cf9fe
     * Codename: pimberly_images
     */
    pimberlyImages: Elements.CustomElement;

    /**
     * Price (number)
     * Required: false
     * Id: 8147b730-1174-440f-b66c-3c7052a27c13
     * Codename: price
     */
    price: Elements.NumberElement;

    /**
     * Product category (taxonomy)
     * Required: false
     * Id: 9cb23fa0-7975-40f3-9b2e-284566ed5610
     * Codename: product_category
     */
    productCategory: Elements.TaxonomyElement<ProductCategory>;

    /**
     * Product image (asset)
     * Required: false
     * Id: ef97bfab-e78d-462a-9a10-092f5dbc133e
     * Codename: product_image
     */
    productImage: Elements.AssetsElement;

    /**
     * SKU (text)
     * Required: false
     * Id: 89b5849d-c60a-4a06-9c02-d4dcd74ef692
     * Codename: sku
     */
    sku: Elements.TextElement;

    /**
     * Title (text)
     * Required: false
     * Id: 11b1fdeb-c495-4b26-9004-7eb7d1cc1fef
     * Codename: title
     */
    title: Elements.TextElement;

    /**
     * Slug (url_slug)
     * Required: false
     * Id: 93ac7a11-2b9f-410c-9ce7-9d95e90b0960
     * Codename: url
     */
    url: Elements.UrlSlugElement;
}> &
    OpenGraphMetadata &
    SEOMetadata;
