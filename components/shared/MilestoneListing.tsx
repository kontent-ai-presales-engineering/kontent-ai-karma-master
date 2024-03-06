import React, { FC } from 'react';
import { MilestoneListing, contentTypes } from '../../models';
import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import Image from 'next/image';

type Props = Readonly<{
  item: MilestoneListing;
}>;

export const MilestoneListingComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <div
      className={`bg-gradient-to-tl from-cyan-300 to-slate-400 w-screen relative component_full-width`}
      {...createItemSmartLink(
        props.item.system.id,
        props.item.system.name
      )}
      {...createElementSmartLink(
        contentTypes.milestone_listing.elements.grid_items.codename
      )}
      {...createFixedAddSmartLink('end')}
    >
      <div
        className={`flex flex-wrap mx-auto w-full max-w-screen-xl py-10 ${mainColorTextClass[siteCodename]} justify-center`}
      >
        {props.item.elements.gridItems.linkedItems.map((link) => (
          <div
            className='my-10 p-4 px-6 flex flex-col text-center sm:w-1/2 md:w-1/3'
            key={link.system.id}
            {...createItemSmartLink(link.system.id, link.system.name)}
          >
            {link.elements.iconOptional?.value[0] && (
              <div className='flex justify-center items-center'>
                <Image
                  src={`${link.elements.iconOptional.value[0]?.url}`}
                  alt={link.elements.iconOptional.value[0]?.description}
                  width={link.elements.iconOptional.value[0]?.width}
                  height={link.elements.iconOptional.value[0]?.height}
                />
              </div>
            )}
            <div className='font-bold text-3xl mb-4'>
              {link.elements.title.value}
            </div>
            <div>{link.elements.subtitle.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
