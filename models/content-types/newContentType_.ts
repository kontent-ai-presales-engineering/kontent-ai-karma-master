import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * New content type 🚀
 * Id: dce3c2cf-6e88-49b3-9df9-df2bb02bfcbf
 * Codename: new_content_type_
 */
export type NewContentType_ = IContentItem<{
  /**
   * Rich text (rich_text)
   * Required: false
   * Id: 56c66c0f-288d-46bf-a7ce-f7e1bb9bbed6
   * Codename: rich_text
   */
  richText: Elements.RichTextElement;

  /**
   * Title (text)
   * Required: false
   * Id: 21ad05e4-9099-47f7-966c-abbb13f11a8b
   * Codename: title
   */
  title: Elements.TextElement;
}>;
