import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { FC, useState } from 'react';
import { contentTypes, WSL_Page, WSL_WebSpotlightRoot } from '../../../models';
import { useSiteCodename } from '../siteCodenameContext';
import { IContentItem } from '@kontent-ai/delivery-sdk';
import { ResolutionContext, resolveUrlPath } from '../../../lib/routing';
import { isMultipleChoiceOptionPresent } from '../../../lib/utils/element-utils';
import { mainColorBgClass } from '../../../lib/constants/colors';
import { perCollectionSEOTitle } from '../../../lib/constants/labels';
import { PersonasBar } from './personasBar';

type Link = Readonly<WSL_Page>;

type Props = Readonly<{
  item: IContentItem;
  homeContentItem?: WSL_WebSpotlightRoot;
}>;

type MenuListProps = Readonly<{
  items: WSL_Page[];
  activeMenu: string | number;
  smallMenuActive: boolean;
  handleClick: (menuId: string | number) => void;
}>;

type DropdownMenuProps = Readonly<{
  links: ReadonlyArray<Link>;
}>;

const MenuList: FC<MenuListProps> = (props) => {
  const router = useRouter();
  const siteCodename = useSiteCodename();

  return (
    <ul
      className={`${
        props.smallMenuActive ? 'flex' : 'hidden'
      } flex-col md:flex md:gap-4 font-medium md:flex-row h-full`}
    >
      {props.items.map(
        (link, i) =>
          isMultipleChoiceOptionPresent(
            link.elements.navigationStructures?.value,
            'footer'
          ) && (
            <li key={i} onClick={() => props.handleClick(i)}>
              {link.elements.subpages.value.length > 0 ? (
                <>
                  <Link
                    rel='noopener noreferrer'
                    className=''
                    href={resolveUrlPath(
                      {
                        type: link.system.type,
                        slug: link.elements.url.value,
                      } as ResolutionContext,
                      link.system.language
                    )}
                  >
                    {link.elements.title.value}
                  </Link>
                  <ChildLinks links={link.elements.subpages.linkedItems} />
                </>
              ) : (
                <Link
                  rel='noopener noreferrer'
                  className=''
                  href={resolveUrlPath(
                    {
                      type: link.system.type,
                      slug: link.elements.url.value,
                    } as ResolutionContext,
                    link.system.language
                  )}
                >
                  {link.elements.title.value}
                </Link>
              )}
            </li>
          )
      )}
    </ul>
  );
};

const ChildLinks: FC<DropdownMenuProps> = (props) => {
  const router = useRouter();

  return (
    <ul>
      {props.links.map(
        (link) =>
          isMultipleChoiceOptionPresent(
            link.elements.navigationStructures?.value,
            'footer'
          ) && (
            <li key={link.system.codename}>
              <Link
                rel='noopener noreferrer'
                className=''
                href={resolveUrlPath(
                  {
                    type: link.system.type,
                    slug: link.elements.url.value,
                  } as ResolutionContext,
                  link.system.language
                )}
              >
                {link.elements.title.value}
              </Link>
            </li>
          )
      )}
    </ul>
  );
};

export const Footer: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive] = useState(false);
  const handleMenuClick = (menuId: string | number): void =>
    setActiveMenu(menuId === activeMenu ? -1 : menuId);
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-tl from-rose-950 to-manufacturing-dark w-screen py-8 text-white'>
      <div className='flex items-center mx-auto max-w-screen-xl px-4'>
        <div className='w-screen h-full md:flex justify-between z-40 md:pr-24 xl:pr-12 2xl:pr-0'>
          <div className='flex flex-row w-full justify-center'>            
            <div>{perCollectionSEOTitle[siteCodename]}</div>
            <div className='border-l-2 border-r-2 pl-4 ml-4 pr-4 mr-4'>Copyright {currentYear}</div>
            <PersonasBar display='desktop' />
            {/* <MenuList
              smallMenuActive={smallMenuActive}
              items={props.homeContentItem.elements.subpages.linkedItems}
              handleClick={handleMenuClick}
              activeMenu={activeMenu}
            /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'FooterMenu';
