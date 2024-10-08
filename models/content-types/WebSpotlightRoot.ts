import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type Page } from './Page';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * 🌐 Web Spotlight Root
 * Id: 70a78305-2ef2-4f5d-9677-b01866e2f472
 * Codename: web_spotlight_root
 */
export type WebSpotlightRoot = IContentItem<{
    /**
     * Content (rich_text)
     * Required: false
     * Id: cfacf602-c3a9-44d5-bafd-aea5af865ab9
     * Codename: content
     */
    content: Elements.RichTextElement;

    /**
     * Hide (multiple_choice)
     * Required: false
     * Id: 2550f663-2e78-43cf-bdb1-43ee00e9790c
     * Codename: hide
     */
    hide: Elements.MultipleChoiceElement;

    /**
     * Logo (asset)
     * Required: false
     * Id: 5d7a0146-b986-4587-bf5c-3ba3111aa441
     * Codename: logo
     */
    logo: Elements.AssetsElement;

    /**
     * Name (text)
     * Required: false
     * Id: d53ff95e-3ced-4a2f-9963-e640e6937a8b
     * Codename: name
     */
    name: Elements.TextElement;

    /**
     * Secure Page (multiple_choice)
     * Required: false
     * Id: b43ae02e-8789-424e-8179-6b2d74d4bba5
     * Codename: secure_page
     */
    securePage: Elements.MultipleChoiceElement;

    /**
     * Subpages (subpages)
     * Required: false
     * Id: 68783b8a-a680-4d5e-aed1-5e136815f4ef
     * Codename: subpages
     */
    subpages: Elements.LinkedItemsElement<Page>;

    /**
     * Tagline (text)
     * Required: false
     * Id: 86c798ef-25ed-41e0-92c6-3b566161fd9d
     * Codename: tagline
     */
    tagline: Elements.TextElement;

    /**
     * Title (text)
     * Required: false
     * Id: f66fd9c8-1894-4223-979a-0b829cb0ece2
     * Codename: title
     */
    title: Elements.TextElement;

    /**
     * URL (url_slug)
     * Required: false
     * Id: 48a58dda-a112-443d-853c-d99d3012944d
     * Codename: url
     */
    url: Elements.UrlSlugElement;
}> &
    OpenGraphMetadata &
    SEOMetadata;
