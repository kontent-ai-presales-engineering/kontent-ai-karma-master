import React, { FC } from 'react'
import { Block_PanelListing } from '../../models'
import { mainColorBgClass, mainColorTextClass } from '../../lib/constants/colors'
import { useSiteCodename } from './siteCodenameContext'

type Props = Readonly<{
  item: Block_PanelListing
}>

export const PanelListingComponent: FC<Props> = props => {
  const siteCodename = useSiteCodename();

  return (
    <div>
      Found Panel Listing component!
      {props.item.elements.panels.linkedItems.map((link) => (
          <div className="p-4 flex flex-col text-center items-center" key={link.system.id}>
            <div className="font-bold text-3xl">{link.elements.heading.value}</div>
            <div>{link.elements.blurb.value}</div>
            <div>{link.elements.image.value[0]?.url}</div>
            <div>{link.elements.link.value}</div>
          </div>
        ))}

      <section className="bg-gray-100 dark:bg-gray-900 py-10 px-12">
        <div className="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1" x-for="(post, index) in posts">
            <a href="link" className="cursor-pointer">
              <figure>
                <img src="?auto=format&fit=crop&w=400&q=50" className="rounded-t h-72 w-full object-cover" />
                <figcaption className="p-4">
                  <p className="text-lg mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300" x-text="post.title">
                  </p>
                  <small
                    className="leading-5 text-gray-500 dark:text-gray-400" x-text="post.description">Hello
                  </small>
                </figcaption>
              </figure>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}