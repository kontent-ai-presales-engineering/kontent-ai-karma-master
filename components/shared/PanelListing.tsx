import React, { FC } from 'react';
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from '../../lib/utils/smartLinkUtils';
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
      className='bg-gray-1 dark:bg-gray-000 py-10 px-6 md:px-12'
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
      {...createFixedAddSmartLink('end')}
    >
      <div
        className={`flex gap-8 flex-col ${childItemOrientation === 'vertical' ? 'flex-col' : 'lg:flex-row'
          }`}
      >
        {props.item.elements.panels.linkedItems.map((link) => (
          <div
            className={`${childItemOrientation === 'vertical' ? 'my-0' : 'my-8'
              }  rounded shadow-lg shadow-gray-200 bg-white duration-300 hover:-translate-y-3 w-full lg:w-1/3`}
            key={link.system.id}
            {...createItemSmartLink(props.item.system.id, props.item.system.codename)}
            {...createElementSmartLink(
              contentTypes._panel.elements.blurb.codename
            )}
            {...createFixedAddSmartLink('end')}
          >
            <a
              href={link.elements.link.value}
              className={` ${link.elements.link.value === ''
                  ? 'cursor-default pointer-events-none'
                  : 'cursor-pointer'
                } no-underline`}
            >
              <figure>
                <figcaption
                  className={`${childItemOrientation === 'vertical' ? 'flex gap-10' : ''
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
                    className={`${childItemOrientation === 'vertical' ? 'mt-0' : ''
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
