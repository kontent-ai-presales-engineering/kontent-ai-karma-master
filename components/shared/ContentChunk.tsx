import { FC } from 'react';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { ContentChunk, contentTypes } from '../../models';
import { RichTextElement } from './richText/RichTextElement';

type Props = Readonly<{
  item: ContentChunk;
}>;

export const ContentChunkComponent: FC<Props> = (props) => {  
  const textAlignClass = {
    "left": "text-left",
    "center": "text-center",
    "right": "text-right",
};
  return (
    <div
      style={{ backgroundColor: props.item.elements.backgroundColor?.value}}
      className={`w-screen relative left-1/2 right-1/2 [margin-left:-50vw] bg-blue ${textAlignClass[props.item.elements.textAlignment.value[0]?.codename]}`}
    >
      <div
        className={`vis-container mx-auto w-full max-w-screen-xl py-10`}
        {...createItemSmartLink(props.item.system.id, props.item.system.codename)}
        {...createElementSmartLink(
          contentTypes.content_chunk.elements.content.codename
        )}
        {...createFixedAddSmartLink('end')}
      >
        <RichTextElement
          element={props.item.elements.content}
          isInsideTable={false}
          language={props.item.system.language}
        />
      </div>
    </div>)
};
