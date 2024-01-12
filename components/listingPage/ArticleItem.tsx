import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import {
  mainColorBgClass,
  mainColorTextClass,
  mainColorHoverClass,
} from '../../lib/constants/colors';
import { formatDate } from '../../lib/utils/dateTime';
import { useSiteCodename } from '../shared/siteCodenameContext';
import { StandaloneSmartLinkButton } from '../shared/StandaloneSmartLinkButton';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';

type Props = Readonly<{
  imageUrl: string;
  title: string;
  detailUrl: string;
  description: string;
  publishingDate: string | null;
  itemId?: string;
  itemName?: string;
  locale?: string;
}>;

export const ArticleItem: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <li
      className='flex grow basis-0 items-stretch m-0 p-0 relative rounded-lg shadow-lg shadow-gray-200 hover:shadow-xl transition-shadow cursor-pointer '
      {...createItemSmartLink(props.itemId, props.itemName)}
    >
      <Link
        href={props.detailUrl}
        className='no-underline h-full flex flex-col'
      >
        <div>
          <figure className='w-full relative m-0 h-40'>
            <Image
              src={props.imageUrl}
              alt={props.title}
              fill
              sizes='(max-width: 635px) 100vw, (max-width: 1275px) 50vw, 25vw'
              className='object-cover h-full m-0 p-0 rounded-t-lg'
            />
          </figure>
          {props.publishingDate && (
            <div className='w-fit p-2 bg-gray-800 text-white opacity-90 font-normal line-clamp-6 absolute right-0 translate-y-[-100%]'>
              <p className='m-0 w-fit'>
                {formatDate(props.publishingDate, props.locale)}
              </p>
            </div>
          )}
        </div>
        <div className='grow p-5'>
          <h3 className='mb-2 mt-4 text-xl font-bold tracking-tight text-gray-900 no-underline line-clamp-2 '>
            {props.title}
          </h3>
          <p className='mb-0 font-normal text-gray-700 line-clamp-5'>
            {props.description}
          </p>
        </div>
        <button
          className={`${mainColorTextClass[siteCodename]} block mx-auto w-fit mt-4 mb-8 font-semibold line-clamp-6 ${mainColorHoverClass[siteCodename]} ${mainColorBgClass[siteCodename]} py-2 px-4 rounded hover:scale-105 duration-100 `}
        >
          Continue reading
        </button>
      </Link>
    </li>
  );
};

ArticleItem.displayName = 'ListItem';
