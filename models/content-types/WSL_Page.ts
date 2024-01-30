import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type NavigationStructures } from '../taxonomies/navigationStructures';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 💡 Page
 * Id: 5aab1bd3-9433-40d2-8e0f-cbda835ec5fd
 * Codename: page
 */
export type WSL_Page = IContentItem<{
  /**
   * Content (rich_text)
   * Required: false
   * Id: 756bc39a-7d70-4faa-9116-eeacd689ff4f
   * Codename: content
   */
  content: Elements.RichTextElement;

  /**
   * Footer (rich_text)
   * Required: false
   * Id: 8b5f9f98-2707-4d90-a641-79f8115869ba
   * Codename: footer
   */
  footer: Elements.RichTextElement;

  /**
   * Hide (multiple_choice)
   * Required: false
   * Id: 5ced7906-8b8b-4707-af65-354ac0ef5e6f
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
   * Override logo (asset)
   * Required: false
   * Id: 92701efa-f23b-4133-abac-0612fdabda60
   * Codename: override_logo
   */
  overrideLogo: Elements.AssetsElement;

  /**
   * Subpages (subpages)
   * Required: false
   * Id: 890cb2c8-fc22-4744-8965-0e8bfe284c62
   * Codename: subpages
   */
  subpages: Elements.LinkedItemsElement<WSL_Page>;

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
