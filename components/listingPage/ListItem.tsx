import { FC } from "react";
import Image from "next/image"
import Link from "next/link";
import { StandaloneSmartLinkButton } from "../shared/StandaloneSmartLinkButton";

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  itemId?: string;
  itemName?: string;
}>;

export const ListItem: FC<Props> = props => (
  <li className="w-64 relative rounded-xl shadow hover:shadow-xl transition-shadow border cursor-pointer">
    <StandaloneSmartLinkButton itemId={props.itemId} itemName={props.itemName} />
    <Link href={props.detailUrl}>
      <figure className="w-full h-40 relative">
        <Image
          src={props.imageUrl}
          alt={props.title}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </figure>
      <div className="border-t-2 rounded border-t-gray-100 mx-3 my-3" />
      <div className="w-full flex justify-center pt-4 pb-8">
        <b className="text-center">{props.title}</b>
      </div>
    </Link>
  </li>
);

ListItem.displayName = "ListItem";
