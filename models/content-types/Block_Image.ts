import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * 🧱 Image
 * Id: d5f29377-9b6c-4d09-8ad7-d10471316a36
 * Codename: image
 */
export type Block_Image = IContentItem<{
  /**
   * Align (multiple_choice)
   * Required: false
   * Id: 8613b03e-2238-448b-a06e-06f2c9209137
   * Codename: align
   */
  align: Elements.MultipleChoiceElement;

  /**
   * Caption (text)
   * Required: false
   * Id: 2264e3ec-e128-4774-b66e-ad72a2d2883c
   * Codename: caption
   */
  caption: Elements.TextElement;

  /**
   * Focal point picker (custom)
   * Required: false
   * Id: 74f69950-e0f6-425a-ab5f-58a668d172e9
   * Codename: focal_point_picker
   */
  focalPointPicker: Elements.CustomElement;

  /**
   * Image (asset)
   * Required: true
   * Id: e7d07eeb-42ed-4774-8aca-64a85066e3bb
   * Codename: image
   */
  image: Elements.AssetsElement;
}>;