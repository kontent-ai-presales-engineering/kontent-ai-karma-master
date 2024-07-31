import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Page } from './page';

/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 *
 * Call to Action
 * Id: 068970e2-e5ba-44be-8bc4-66acb19547f1
 * Codename: call_to_action
 */
export type CallToAction = IContentItem<{
    /**
     * Item Target (modular_content)
     * Required: false
     * Id: 513c3019-0fbc-4e4c-9ef5-bc37b7f70dee
     * Codename: item_target
     */
    itemTarget: Elements.LinkedItemsElement<Page>;

    /**
     * Manual Target (text)
     * Required: false
     * Id: 03b11077-1053-44dd-8047-c1119d0b393a
     * Codename: manual_target
     */
    manualTarget: Elements.TextElement;

    /**
     * Title (text)
     * Required: false
     * Id: f23fb051-8fdb-4067-b02b-5b4313ceaa06
     * Codename: title
     */
    title: Elements.TextElement;
}>;
