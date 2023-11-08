import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type ContentChunk } from './contentChunk';
import { type CourseCategory } from '../taxonomies/courseCategory';
import { type CourseType } from '../taxonomies/courseType';
import { type EnrollmentStatus } from '../taxonomies/enrollmentStatus';
import { type OpenGraphMetadata } from '../content-type-snippets/openGraphMetadata';
import { type SEOMetadata } from '../content-type-snippets/SEOMetadata';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Course
 * Id: 62fcbb78-ab65-4247-99cc-e29bb789133d
 * Codename: course
 */
export type Course = IContentItem<{
  /**
   * Accessibility Checker (custom)
   * Required: true
   * Id: 22f76cf7-4893-42bc-9ca3-3a374f7c4677
   * Codename: accessibility_checker
   */
  accessibilityChecker: Elements.CustomElement;

  /**
   * Body (rich_text)
   * Required: false
   * Id: 10e3b6eb-79f4-48d9-8b73-e8d7b6ccf9f0
   * Codename: body
   */
  body: Elements.RichTextElement;

  /**
   * Course category (taxonomy)
   * Required: false
   * Id: 9cb23fa0-7975-40f3-9b2e-284566ed5610
   * Codename: course_category
   */
  courseCategory: Elements.TaxonomyElement<CourseCategory>;

  /**
   * Course type (taxonomy)
   * Required: false
   * Id: 2a13de5f-f694-41fb-9623-de8f53ce23fb
   * Codename: course_type
   */
  courseType: Elements.TaxonomyElement<CourseType>;

  /**
   * Description (text)
   * Required: false
   * Id: 84090f1c-7b1e-4cac-a12a-ce08fb302871
   * Codename: description
   */
  description: Elements.TextElement;

  /**
   * Duration in years (text)
   * Required: true
   * Id: 29a1e13d-82bd-4d48-bbb3-7ea364e477ed
   * Codename: duration_in_years
   */
  durationInYears: Elements.TextElement;

  /**
   * Enrollment Status (taxonomy)
   * Required: true
   * Id: 832ab6a5-86b3-4368-81c8-14db4c418cd7
   * Codename: enrollment_status
   */
  enrollmentStatus: Elements.TaxonomyElement<EnrollmentStatus>;

  /**
   * Fee in $ (text)
   * Required: false
   * Id: d3c70282-1f50-4e01-ae10-ea17b39275a8
   * Codename: fee_in__
   */
  feeIn: Elements.TextElement;

  /**
   * Hero image (asset)
   * Required: false
   * Id: ef97bfab-e78d-462a-9a10-092f5dbc133e
   * Codename: hero_image
   */
  heroImage: Elements.AssetsElement;

  /**
   * Next start date (date_time)
   * Required: false
   * Id: 8d93dc7b-c3b6-4237-82d7-73524a5865af
   * Codename: next_start_date
   */
  nextStartDate: Elements.DateTimeElement;

  /**
   * Overview (rich_text)
   * Required: false
   * Id: 59322205-f074-402c-9871-334cdcf5c4e1
   * Codename: overview
   */
  overview: Elements.RichTextElement;

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

  /**
   * Why us (modular_content)
   * Required: false
   * Id: f781dc63-c8d9-477c-8c78-2e3823264ddf
   * Codename: why_us
   */
  whyUs: Elements.LinkedItemsElement<ContentChunk>;
}> &
  OpenGraphMetadata &
  SEOMetadata;