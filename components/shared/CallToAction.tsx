import { FC } from 'react';
import { CallToAction } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { Elements } from '@kontent-ai/delivery-sdk';
import {
  mainColorBgClass,
  mainColorTextClass,
  mainColorHoverClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';
import { ResolutionContext, resolveUrlPath } from '../../lib/routing';

type Props = Readonly<{
  item: CallToAction;
}>;

export const CallToActionComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();
  let url = props.item.elements.manualTarget.value;
  if (props.item.elements.itemTarget.linkedItems[0]?.elements.url) {
    const slugElement = props.item.elements.itemTarget.linkedItems[0]?.elements
      .url as Elements.UrlSlugElement;
    url = resolveUrlPath(
      {
        type: props.item.elements.itemTarget.linkedItems[0]?.system.type,
        slug: slugElement.value,
      } as ResolutionContext,
      props.item.elements.itemTarget.linkedItems[0]?.system.language
    );
  }

  return (
    <button
      {...createItemSmartLink(
        props.item.system.id,
        props.item.system.name,
        true
      )}
      className={`${mainColorBgClass[siteCodename]} ${mainColorTextClass[siteCodename]} ${mainColorHoverClass[siteCodename]} font-bold py-3 px-8 m-3 rounded duration-100 hover:scale-105 hover:drop-shadow`}
    >
      {props.item.elements.title.value}
    </button>
  );
};

CallToActionComponent.displayName = 'CallToActionComponent';
