import React, { FC } from 'react';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { PanelListing, contentTypes } from '../../models';
import { useSiteCodename } from './siteCodenameContext';
import Image from 'next/image';

type Props = Readonly<{
  item: PanelListing;
}>;

export const PanelListingComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  const childItemOrientation =
    props.item.elements.orientation?.value[0]?.codename;

  return (
    <section
      className='bg-gray-1 g-gray-000 py-4'
      {...createItemSmartLink(
        props.item.system.id,
        props.item.system.name
      )}
      {...createElementSmartLink(
        contentTypes.panel_listing.elements.panels.codename
      )}
      {...createFixedAddSmartLink('end')}
    >
      <div
        className={`flex gap-8 flex-col ${
          childItemOrientation === 'vertical' ? 'flex-col' : 'lg:flex-row'
        }`}
      >
        {props.item.elements.panels.linkedItems.map((link) => (
          <div
            className={`${
              childItemOrientation === 'vertical' ? 'my-0  w-full ' : 'lg:w-1/3'
            }  rounded shadow-lg shadow-gray-200 bg-white duration-300 hover:-translate-y-3 `}
            key={link.system.id}
            {...createItemSmartLink(
              link.system.id,
              link.system.name
            )}
          >
            <a
              href={` ${
                link.elements.link.value === '' ? '#' : link.elements.link.value
              }`}
              className={` ${
                link.elements.link.value === ''
                  ? 'cursor-default pointer-events-none'
                  : 'cursor-pointer'
              } no-underline`}
            >
              <figure>
                <figcaption
                  className={`${
                    childItemOrientation === 'vertical'
                      ? 'flex gap-10 md:flex-row'
                      : ''
                  } px-6 mt-0 flex flex-col`}
                >
                  <div>
                    <h3 className='mt-0'>{link.elements.heading.value}</h3>
                    <p className='font-normal line-clamp-5'>
                      {link.elements.blurb.value}
                    </p>
                  </div>
                  <div className='min-w-[50%]'>
                    <Image
                      src={`${link.elements.image.value[0]?.url}`}
                      alt={link.elements.image.value[0]?.description}
                      width={400}
                      height={400}
                      className={`${
                        childItemOrientation === 'vertical' ? 'mt-0 ' : ''
                      } rounded-lg h-72 w-full object-cover mb-0`}
                    />
                  </div>
                </figcaption>
              </figure>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
