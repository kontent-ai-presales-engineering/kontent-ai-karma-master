import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Block_HeroUnit } from './Block_HeroUnit';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 🧱 Carousel
 * Id: d3157a0b-928c-4c69-b3d5-8816e9e8e406
 * Codename: carousel
 */
export type Block_Carousel = IContentItem<{
  /**
   * Elements (modular_content)
   * Required: false
   * Id: 0c889cf7-b807-4a92-80bc-c0e500d8f1b5
   * Codename: elements
   */
  elements: Elements.LinkedItemsElement<Block_HeroUnit>;
}>;
