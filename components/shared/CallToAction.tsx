import { FC } from "react";
import { Block_CallToAction } from "../../models";
import { createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { resolveLink } from "../../lib/utils/link-utils";
import { Elements } from "@kontent-ai/delivery-sdk";
import { mainColorBgClass, mainColorTextClass } from "../../lib/constants/colors";
import { useSiteCodename } from "./siteCodenameContext";

type Props = Readonly<{
  item: Block_CallToAction;
}>;

export const CallToActionComponent: FC<Props> = props => {  
  const siteCodename = useSiteCodename();
  let url = props.item.elements.manualTarget.value
  if (props.item.elements.itemTarget.linkedItems[0]?.elements.url) {
      const slugElement = props.item.elements.itemTarget.linkedItems[0]?.elements.url as Elements.UrlSlugElement
      url = resolveLink(
          { type: props.item.elements.itemTarget.linkedItems[0]?.system.type, urlSlug: slugElement.value }, props.item.elements.itemTarget.linkedItems[0]?.system.language
      );
  }

  return (
    <button
    {...createItemSmartLink(props.item.system.id, props.item.system.name, true)}
      className={`${mainColorBgClass[siteCodename]} ${mainColorTextClass[siteCodename]} hover:bg-blue-700  font-bold py-2 px-4 m-3 rounded`}
    >
          {props.item.elements.title.value}
    </button>
  );
}

CallToActionComponent.displayName = "CallToActionComponent";