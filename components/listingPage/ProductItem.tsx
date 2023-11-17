import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import {
  mainColorBgClass,
  mainColorTextClass,
  mainColorHoverClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from '../shared/siteCodenameContext';
import { StandaloneSmartLinkButton } from '../shared/StandaloneSmartLinkButton';

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  price: number | null;
  category: string;
  itemId?: string;
  itemName?: string;
}>;

export const ProductItem: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <li className='min-w-full m-0 p-0 relative rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer min-h-full flex flex-col h-full'>
      <Link
        href={props.detailUrl}
        className='no-underline p-2 m-0 justify-items-stretch flex flex-col min-h-full flex-1 h-full'
      >
        <StandaloneSmartLinkButton
          itemId={props.itemId}
          itemName={props.itemName}
        />

        <div className='grid grid-cols-1 gap-3 h-full content-between'>
          <div>
            <h5 className='px-4 pt-2 mt-2 text-center text-lg font-semibold text-gray-900'>
              {props.title}
            </h5>
            <p className='m-0 text-center text-gray-500 text-base'>
              {props.category}
            </p>
          </div>
          <figure className='w-full relative m-0 h-40'>
            <Image
              src={props.imageUrl}
              alt={props.title}
              fill
              sizes='(max-width: 635px) 100vw, (max-width: 1534px) 50vw, 25vw'
              className='object-contain h-full w-full m-0 p-0 rounded-t-lg'
            />
          </figure>
          {props.price && (
            <p className='m-0 text-center text-base font-normal pb-2'>
              {`${props.price}€`}
            </p>
          )}
          <button
            className={`${mainColorBgClass[siteCodename]} ${mainColorTextClass[siteCodename]} ${mainColorHoverClass[siteCodename]} font-bold py-3 px-8 m-3 rounded duration-100 hover:scale-105 hover:drop-shadow mt-6 mx-auto`}
          >
            Detail
          </button>
        </div>
      </Link>
    </li>
  );
};

ProductItem.displayName = 'ListItem';
