import Image from "next/image"
import { FC } from "react";

import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { Block_Image, contentTypes } from "../../models";

type Props = Readonly<{
  item: Block_Image;
}>;

import { Elements } from '@kontent-ai/delivery-sdk';

export interface IFocalPoint {
    readonly fpX: string;
    readonly fpY: string;
    readonly pointYOffset: string;
    readonly pointXOffset: string;
}

export const parseFocalCustomElement = (focalCustomElement: Elements.CustomElement): IFocalPoint =>
focalCustomElement.value && JSON.parse(focalCustomElement.value);

export const getFocalPoint = (focalCustomElement: Elements.CustomElement): IFocalPoint =>
parseFocalCustomElement(focalCustomElement);

export const ImageComponent: FC<Props> = props => {
  const image = props.item.elements.image.value[0];
  const focalPoint = getFocalPoint(props.item.elements.focalPointPicker);
  let imageUrl = ""
  imageUrl = focalPoint && `${image.url}?fit=crop&crop=focalpoint&fp-x=${focalPoint.fpX}&fp-y=${focalPoint.fpY}&fp-z=2`
  imageUrl = image.renditions.default ? `${image.url}?${image.renditions.default?.query}` : imageUrl
  const imageWidth = image.renditions.default ? image.renditions.default.width : image.width
  const imageHeight = image.renditions.default ? image.renditions.default.height : image.height
  return (
    <figure
      className={`max-w-lg m-10 float-${props.item.elements.align.value[0].codename}`}
      {...createItemSmartLink(props.item.system.id, props.item.system.name, true)}
    >
      {imageUrl && (
          <img
            src={imageUrl}
            alt={image.description}
            className={`h-auto max-w-full rounded-lg`}
          />
      )}
      {image && !imageUrl && (
          <Image
            src={image.url}
            alt={image.description}
            height={imageHeight}
            width={imageWidth}
            className={`h-auto max-w-full rounded-lg`}
          />
      )}
      {props.item.elements.caption.value && (
      <figcaption 
      className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400"
      {...createElementSmartLink(contentTypes.image.elements.caption.codename)}>
        {props.item.elements.caption.value}
        </figcaption>
      )}

    </figure>
  );
}
