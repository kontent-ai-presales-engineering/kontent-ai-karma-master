import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type NavigationStructures } from '../taxonomies/navigationStructures';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * 📄 Page
 * Id: 5aab1bd3-9433-40d2-8e0f-cbda835ec5fd
 * Codename: page
 */
export type Page = IContentItem<{
    /**
     * Content (rich_text)
     * Required: false
     * Id: 756bc39a-7d70-4faa-9116-eeacd689ff4f
     * Codename: content
     */
    content: Elements.RichTextElement;

    /**
     * Hide (multiple_choice)
     * Required: false
     * Id: eb5a5ebb-18f1-40bb-9be9-25cc615de657
     * Codename: hide
     */
    hide: Elements.MultipleChoiceElement;

    /**
     * Navigation Structures (taxonomy)
     * Required: false
     * Id: 943b2571-e126-47ae-814e-179b78aad2f7
     * Codename: navigation_structures
     */
    navigationStructures: Elements.TaxonomyElement<NavigationStructures>;

    /**
     * Secure Page (multiple_choice)
     * Required: false
     * Id: 5cc48d9d-caa5-4939-a33e-9eff9a815836
     * Codename: secure_page
     */
    securePage: Elements.MultipleChoiceElement;

    /**
     * Subpages (subpages)
     * Required: false
     * Id: 890cb2c8-fc22-4744-8965-0e8bfe284c62
     * Codename: subpages
     */
    subpages: Elements.LinkedItemsElement<Page>;

    /**
     * Title (text)
     * Required: false
     * Id: 93218af9-0226-422a-b1a0-27ad0058dcf4
     * Codename: title
     */
    title: Elements.TextElement;

    /**
     * URL (url_slug)
     * Required: false
     * Id: a1f23c97-017d-4764-bc39-82050166b371
     * Codename: url
     */
    url: Elements.UrlSlugElement;
}> &
    OpenGraphMetadata &
    SEOMetadata;
