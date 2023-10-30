import { FC } from 'react';
import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import {
  formatDate,
  formatDateDay,
  formatMonthsForLocale,
} from '../../lib/utils/dateTime';
import { useSiteCodename } from '../shared/siteCodenameContext';
import Link from 'next/link';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';

type Props = Readonly<{
  title: string;
  location: string;
  organizer: string;
  startDate: string | null;
  endDate: string | null;
  locale: string | null;
  itemId?: string;
  itemName?: string;
  detailUrl?: string;
}>;

export const EventItem: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <Link href={props.detailUrl} className='no-underline'>
      <div
        className='lg:flex md:rounded-lg shadow-lg shadow-gray-200 mb-4 hover:-translate-y-3 duration-300'
        {...createItemSmartLink(props.itemId, props.itemName)}
      >
        <div
          className={`${mainColorTextClass[siteCodename]} ${mainColorBgClass[siteCodename]} rounded-lg lg:w-2/12 py-4 block h-full bg-gradient-to-tl from-manufacturing-dark via-manufacturing-light to-manufacturing-light`}
        >
          {props.startDate && (
            <div className='text-center tracking-wide'>
              <div className='font-bold text-4xl '>
                {formatDateDay(props.startDate)}
              </div>
              <div className='font-normal text-2xl'>
                {formatMonthsForLocale(props.startDate, props.locale, 'short')}
              </div>
            </div>
          )}
        </div>
        <div className='w-full  lg:w-11/12 xl:w-full px-1 py-5 lg:px-2 lg:py-2 tracking-wide'>
          <div className='flex flex-row lg:justify-start justify-center'>
            <div className='text-gray-700 font-medium text-sm text-center lg:text-left px-2'>
              Location : {props.location}
            </div>
          </div>
          <div className='font-semibold text-gray-800 text-xl text-center lg:text-left px-2'>
            {props.title}
          </div>
          {
            <div className='text-gray-600 font-medium text-sm pt-1 text-center lg:text-left px-2'>
              {props.startDate ? formatDate(props.startDate) : ''}{' '}
              {props.endDate ? '- ' + formatDate(props.endDate) : ''}
            </div>
          }
        </div>
      </div>
    </Link>
  );
};

EventItem.displayName = 'ListItem';
