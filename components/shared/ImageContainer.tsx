import { FC } from 'react';
import { Block_ImageContainer, contentTypes } from '../../models';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import Image from 'next/image';
import { RichTextElement } from './RichTextContent';

type Props = Readonly<{
  item: Block_ImageContainer;
}>;

export const ImageContainerComponent: FC<Props> = (props) => {
  const thumb = props.item.elements.image.value[0]?.url;
  const thumbWidth = 768;
  const thumbHeight = 432;
  const thumbAlt = props.item.elements.image.value[0]?.description;
  const image = (
    <Image
      className='object-cover w-full md:w-1/2 lg:w-1/3 m-0'
      src={thumb}
      width={thumbWidth}
      height={thumbHeight}
      priority
      alt={thumbAlt as string}
    />
  );
  return (
    <div
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
      className='w-full rounded-lg shadow-md lg:flex md:flex shadow-black-600'
    >
      {props.item.elements.imageLocation.value[0].codename == 'left' && image}
      <div className='px-6 py-4'>
        <h5
          className='mb-3 text-base font-semibold tracking-tight text-sky-600'
          {...createElementSmartLink(
            contentTypes.image_container.elements.heading.codename
          )}
        >
          {props.item.elements.heading?.value}
        </h5>
        <div
          className='mb-2 text-sm leading-normal text-justify text-sky-900'
          {...createElementSmartLink(
            contentTypes.image_container.elements.content.codename
          )}
        >
          <RichTextElement
            element={props.item.elements.content}
            isInsideTable={false}
            language={props.item.system.language}
          />
        </div>
      </div>
      {props.item.elements.imageLocation.value[0].codename == 'right' && image}
    </div>
  );
};

ImageContainerComponent.displayName = 'ImageContainerComponent';
