import React, { FC, useMemo } from 'react';
import { MilestoneListing, contentTypes } from '../../models';
import { mainColorBgClass, mainColorTextClass } from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import Image from 'next/image';

type Props = {
  item: MilestoneListing;
};

const GridItem: FC<{ link: any }> = ({ link }) => {
  const image = link.elements.iconOptional?.value[0];
  return (
    <div
      className='my-10 p-4 px-6 flex flex-col text-center sm:w-1/2 md:w-1/3'
      key={link.system.id}
      {...createItemSmartLink(link.system.id, link.system.name)}
    >
      {image && (
        <div className='flex justify-center items-center'>
          <Image
            src={image.url}
            alt={image.description}
            width={image.width}
            height={image.height}
          />
        </div>
      )}
      <div className='font-bold text-3xl mb-4'>
        {link.elements.title.value}
      </div>
      <div>{link.elements.subtitle.value}</div>
    </div>
  );
};

export const MilestoneListingComponent: FC<Props> = ({ item }) => {
  const siteCodename = useSiteCodename();
  const gridItems = item.elements.gridItems?.linkedItems;

  const smartLinksAttributes = useMemo(() => ({
    ...createItemSmartLink(item.system.id, item.system.name),
    ...createElementSmartLink(contentTypes.milestone_listing.elements.grid_items.codename),
    ...createFixedAddSmartLink('end'),
  }), [item.system.id, item.system.name]);

  return (
    <div
      className={`bg-gradient-to-tl from-cyan-300 to-slate-400 w-screen relative component_full-width`}
      {...smartLinksAttributes}
    >
      <div
        className={`flex flex-wrap mx-auto w-full max-w-screen-xl py-10 ${mainColorTextClass[siteCodename]} justify-center`}
      >
        {gridItems?.length > 0 && gridItems.map((link) => (
          <GridItem key={link.system.id} link={link} />
        ))}
      </div>
    </div>
  );
};