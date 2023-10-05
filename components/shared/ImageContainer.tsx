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
      className='object-cover w-full m-0'
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
      className='w-full rounded-lg lg:flex md:flex pr-40'
    >
      {props.item.elements.imageLocation.value[0].codename == 'left' && image}
      <div className=' py-4 flex flex-col justify-center'>
        <h2
          className='mb-3 font-semibold tracking-tight'
          {...createElementSmartLink(
            contentTypes.image_container.elements.heading.codename
          )}
        >
          {props.item.elements.heading?.value}
        </h2>
        <div
          className='mb-2 font-semibold eading-normal'
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
