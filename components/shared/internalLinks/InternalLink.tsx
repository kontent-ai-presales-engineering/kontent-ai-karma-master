import { ILink } from "@kontent-ai/delivery-sdk"
import { FC, ReactNode } from "react";

import { contentTypes } from "../../../models";
import { ProductLink } from "./ProductLink";

type Props = Readonly<{
  link: ILink;
  children: ReactNode;
  language: string;
}>;

export const InternalLink: FC<Props> = props => {
  switch (props.link.type) {    
    case contentTypes.page.codename:
      return (<a
        href={`/${props.language}/${props.link.urlSlug}`.toLowerCase()}
        className="text-red-300"
      >
        {props.children}</a>)
    case contentTypes.article.codename:
      return (<a
        href={`/${props.language}/${props.link.urlSlug}`.toLowerCase()}
        className="text-red-300"
      >
        {props.children}</a>)
    case contentTypes.product.codename:
      return (
        <ProductLink
          itemCodename={props.link.codename}
          slug={props.link.urlSlug}
        >
          {props.children}
        </ProductLink>
      );
    default:
      return <>props.children</>
  }
}
