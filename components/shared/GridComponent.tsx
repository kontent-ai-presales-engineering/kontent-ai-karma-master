import React, { FC } from 'react';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { ContentChunk, GridComponent, Panel, PanelListing, contentTypes } from '../../models';
import Image from 'next/image';
import { RichTextElement } from './richText/RichTextElement';

type Props = Readonly<{
  item: GridComponent;
}>;

export const Grid: FC<Props> = (props) => {
  const gridSizeClass = {
    1: 'grid-cols-1 gap-1',
    2: 'grid-cols-2 gap-2',
    3: 'grid-cols-3 gap-3',
    4: 'grid-cols-4 gap-4',
    5: 'grid-cols-5 gap-5',
    6: 'grid-cols-6 gap-6',
    7: 'grid-cols-7 gap-7',
    8: 'grid-cols-8 gap-8',
    9: 'grid-cols-9 gap-9',
    10: 'grid-cols-10 gap-10',
    11: 'grid-cols-11 gap-11',
    12: 'grid-cols-12 gap-12',
  }
  return (
    <div
      style={{ color: props.item.elements.layoutOptionTextColor?.value, backgroundColor: props.item.elements.layoutOptionBackgroundColor?.value, paddingTop: props.item.elements.layoutOptionPaddingTop?.value, paddingBottom: props.item.elements.layoutOptionPaddingBottom?.value }}
      className={`pt-10 items-start not-prose grid ${gridSizeClass[props.item.elements.columns.value]}}`}
      {...createItemSmartLink(
        props.item.system.id,
        props.item.system.name
      )}
      {...createElementSmartLink(
        contentTypes.grid_component.elements.content.codename
      )}
      {...createFixedAddSmartLink('end')}
    >
      {props.item.elements.content.linkedItems.map((content: ContentChunk, index) => (
        <div
          className={index + 1 != props.item.elements.content.linkedItems.length ? "mr-8" : ""}
          key={content.system.id}
          {...createItemSmartLink(
            content.system.id,
            content.system.name
          )}
        >
          <RichTextElement
            element={content.elements.content}
            isInsideTable={false}
            language={content.system.language}
          />
        </div>
      ))}
    </div >
  );
};
