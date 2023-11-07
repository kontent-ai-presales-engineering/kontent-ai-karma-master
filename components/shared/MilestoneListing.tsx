import React, { FC } from 'react';
import { MilestoneListing } from '../../models';
import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';

type Props = Readonly<{
  item: MilestoneListing;
}>;

export const MilestoneListingComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <div
      className={`bg-gradient-to-tl from-manufacturing-dark via-manufacturing-light to-manufacturing-light w-screen relative left-1/2 right-1/2 [margin-left:-50vw] mb-24`}
    >
      <div
        className={`flex flex-wrap mx-auto w-full max-w-screen-xl py-10 ${mainColorTextClass[siteCodename]} justify-center`}
      >
        {props.item.elements.gridItems.linkedItems.map((link) => (
          <div
            className='my-10 p-4 flex flex-col text-center sm:w-1/2 md:w-1/3'
            key={link.system.id}
          >
            <div className='font-bold text-3xl'>
              {link.elements.title.value}
            </div>
            <div>{link.elements.subtitle.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
