import React, { FC } from 'react';
import { Block_PanelListing } from '../../models';
import {
  mainColorBgClass,
  mainColorTextClass,
} from '../../lib/constants/colors';
import { useSiteCodename } from './siteCodenameContext';

type Props = Readonly<{
  item: Block_PanelListing;
}>;

export const PanelListingComponent: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();

  return (
    <section className='bg-gray-1 dark:bg-gray-000 py-10 px-12 '>
      <div className='grid grid-flow-row gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
        {props.item.elements.panels.linkedItems.map((link) => (
          <div
            className='my-8 rounded shadow-lg shadow-gray-200 bg-white duration-300 hover:-translate-y-3'
            key={link.system.id}
          >
            <a
              href={link.elements.link.value}
              className='cursor-pointer no-underline'
            >
              <figure>
                <figcaption className='px-4 mt-0'>
                  <h3 className='mt-0'>{link.elements.heading.value}</h3>
                  <p className='font-normal line-clamp-3'>
                    {link.elements.blurb.value}
                  </p>
                  <img
                    src={`${link.elements.image.value[0]?.url}?auto=format&fit=crop&w=400&q=50`}
                    className='rounded-lg h-72 w-full object-cover mb-0'
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
