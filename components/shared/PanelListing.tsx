import React, { FC } from 'react';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { Block_PanelListing } from '../../models';
import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';
import Image from 'next/image';

type Props = Readonly<{
  item: Block_PanelListing;
}>;

export const PanelListingComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  const childItemOrientation =
    props.item.elements.orientation?.value[0]?.codename;

  return (
    <section className='bg-gray-1 dark:bg-gray-000 py-10 px-6 md:px-12'>
      <div
        className={`flex gap-8 flex-col lg:flex-row ${
          childItemOrientation === 'vertical' ? 'flex-col' : ''
        }`}
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.name,
          true
        )}
      >
        {props.item.elements.panels.linkedItems.map((link) => (
          <div
            className={`${
              childItemOrientation === 'vertical' ? 'my-0' : 'my-8'
            }  rounded shadow-lg shadow-gray-200 bg-white duration-300 hover:-translate-y-3`}
            key={link.system.id}
          >
            <a
              href={link.elements.link.value}
              className={` ${
                link.elements.link.value === ''
                  ? 'cursor-default pointer-events-none'
                  : 'cursor-pointer'
              } no-underline`}
            >
              <figure>
                <figcaption
                  className={`${
                    childItemOrientation === 'vertical' ? 'flex gap-10' : ''
                  } px-6 mt-0`}
                >
                  <div>
                    <h3 className='mt-0'>{link.elements.heading.value}</h3>
                    <p className='font-normal line-clamp-3'>
                      {link.elements.blurb.value}
                    </p>
                  </div>
                  <Image
                    src={`${link.elements.image.value[0]?.url}`}
                    alt={link.elements.image.value[0]?.description}
                    width={400}
                    height={400}
                    className={`${
                      childItemOrientation === 'vertical' ? 'mt-0' : ''
                    } rounded-lg h-72 w-full object-cover mb-0`}
                  />
                </figcaption>
              </figure>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
