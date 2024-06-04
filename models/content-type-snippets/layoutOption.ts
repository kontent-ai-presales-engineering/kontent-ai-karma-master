import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * Layout option
 * Id: da5e2015-4a54-45aa-b3b6-a607251f0db4
 * Codename: layout_option
 */
export type LayoutOption = IContentItem<{
    /**
     * Background color (custom)
     * Required: false
     * Id: a2c685a9-b22b-4f95-9c5c-0c14c01e0566
     * Codename: layout_option__background_color
     */
    layoutOptionBackgroundColor: Elements.CustomElement;

    /**
     * Padding bottom (number)
     * Required: false
     * Id: 2f81609d-d85a-412c-ae20-72d4fd27cda4
     * Codename: layout_option__padding_bottom
     */
    layoutOptionPaddingBottom: Elements.NumberElement;

    /**
     * Padding top (number)
     * Required: false
     * Id: 79985035-a902-44c5-bd8d-983cda68d2af
     * Codename: layout_option__padding_top
     */
    layoutOptionPaddingTop: Elements.NumberElement;

    /**
     * Text alignment (multiple_choice)
     * Required: false
     * Id: f81a2bcf-c8db-4f6b-a98e-91265877e258
     * Codename: layout_option__text_alignment
     */
    layoutOptionTextAlignment: Elements.MultipleChoiceElement;

    /**
     * Text color (custom)
     * Required: false
     * Id: 1c485df1-1360-4614-8f77-0f239c8f708a
     * Codename: layout_option__text_color
     */
    layoutOptionTextColor: Elements.CustomElement;
}>;
