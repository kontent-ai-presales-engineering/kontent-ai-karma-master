import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Personas } from '../taxonomies/personas';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Personalization
 * Id: 116d7ad5-28ab-4708-9a72-9c73977952b0
 * Codename: perzonalization
 */
export type Personalization = IContentItem<{
  /**
   * Personas (taxonomy)
   * Required: false
   * Id: f081ccd8-d11a-4418-8798-3b3adbee078c
   * Codename: perzonalization__personas
   */
  perzonalizationPersonas: Elements.TaxonomyElement<Personas>;
}>;
