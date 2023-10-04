import Link from 'next/link';
import { FC } from 'react';

import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { Block_HeroUnit, contentTypes } from '../../models';
import { HeroImage } from '../landingPage/ui/heroImage';
import { useSiteCodename } from './siteCodenameContext';
import { CallToActionComponent } from './CallToAction';
import { RichTextElement } from './RichTextContent';

type Props = Readonly<{
  item: Block_HeroUnit;
}>;

export const HeroUnitComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();
  return (
    <HeroImage
      url={props.item.elements.backgroundImage.value[0]?.url || ''}
      itemId={props.item.system.id}
    >
      <div
        className={`py-5 md:py-5 px-3 w-full flex justify-center`}
        {...createItemSmartLink(props.item.system.id, props.item.system.name)}
      >
        <h1
          className={`${mainColorTextClass[siteCodename]} m-0 text-3xl tracking-wide font-semibold text-center`}
          {...createElementSmartLink(
            contentTypes.hero_unit.elements.title.codename
          )}
        >
          {props.item.elements.title.value}
        </h1>
      </div>
      <div className='py-1 px-3 w-full flex justify-center flex-col items-center'>
        <h2
          className='m-0 text-xl font-medium break-words hyphens-auto text-white text-center w-full md:w-1/2 '
          lang='en'
          {...createElementSmartLink(
            contentTypes.hero_unit.elements.content.codename
          )}
        >
          <RichTextElement
            element={props.item.elements.content}
            isInsideTable={false}
            language={props.item.system.language}
          />
        </h2>
        {props.item.elements.callToAction.linkedItems.map((item) => (
          <CallToActionComponent
            item={item}
            key={item.system.id}
          ></CallToActionComponent>
        ))}
      </div>
    </HeroImage>
  );
};

HeroUnitComponent.displayName = 'HeroUnitComponent';
