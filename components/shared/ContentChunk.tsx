import { FC } from "react";
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from "../../lib/utils/smartLinkUtils";
import {
  Block_ContentChunk,
  contentTypes,
} from "../../models";
import { RichTextElement } from "./richText/RichTextElement";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const ContentChunk: FC<Props> = (props) => (
  <div
    className="px-10 py-5 vis-container"
    {...createItemSmartLink(props.item.system.id, props.item.system.codename)}
    {...createElementSmartLink(
      contentTypes.content_chunk.elements.content.codename
    )}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement
      element={props.item.elements.content}
      isInsideTable={false}
      language={props.item.system.language}
    />
  </div>
);