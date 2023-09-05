import { FC } from "react";
import { createElementSmartLink, createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { useRouter } from "next/router";

type item = Readonly<{
  itemId: string | undefined;
  itemName: string | undefined;
}>;

type ElementCodename = Readonly<{
  elementCodename: string;
}>;

type Props = item | ElementCodename;

export const StandaloneSmartLinkButton: FC<Props> = props => {
  const isPreview = useRouter().isPreview;

  if (!isPreview) {
    return null;
  }

  return (
    <div
      className="absolute right-0 top-0 w-12 h-12 m-0"
      {..."itemId" in props ? createItemSmartLink(props.itemId,  props.itemName) : createElementSmartLink(props.elementCodename)} />
  );
};
