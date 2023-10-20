import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { FC, useState } from 'react';
import { createItemSmartLink } from '../../../lib/utils/smartLinkUtils';
import { contentTypes, WSL_Page, WSL_WebSpotlightRoot } from '../../../models';
import { useSiteCodename } from '../siteCodenameContext';
import { IContentItem } from '@kontent-ai/delivery-sdk';
import { LanguageBar } from './languageBar';
import Search from './search';
import { PreviewSwitcher } from './previewSwitcher';
import { ResolutionContext, resolveUrlPath } from '../../../lib/routing';

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

const isPage = (item: WSL_Page | WSL_WebSpotlightRoot): item is WSL_Page =>
  item.system.type === contentTypes.page.codename;

const isCurrentNavigationItemActive = (
  pageLink: WSL_Page,
  router: NextRouter
) => {
  const pathWithoutQuerystring = router.asPath.replace(/\?.*/, '');
  const pathSegments = pathWithoutQuerystring.split('/');
  const topLevelSegment = pathSegments[1];
  return (
    pageLink &&
    isPage(pageLink) &&
    pageLink.elements.url.value === topLevelSegment
  );
};

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
          link.elements.seoMetadataShowInNavigation.value[0]?.codename !=
            'no' && (
            <li
              key={i}
              className={`${
                isCurrentNavigationItemActive(link, router)
                  ? ''
                  : 'border-l-transparent border-t-transparent'
              }
        border-gray-500 border-l-8 border-t-0 md:border-t-8 md:border-l-0 h-full group grow`}
              onClick={() => props.handleClick(i)}
            >
              {link.elements.subpages.value.length > 0 ? (
                <div
                  className={`${
                    i === props.activeMenu ? 'bg-white text-black' : ''
                  } md:hover:bg-white md:hover:text-black h-full`}
                >
                  <div
                    className={`${
                      i === props.activeMenu ? 'block' : 'hidden'
                    } md:group-hover:block absolute z-50 left-0 shadow-sm bg-white text-black border-gray-200 w-full `}
                  >
                  </div>
                </div>
              ) : (
                <Link
                  rel='noopener noreferrer'
                  className='h-full flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-black border-b border-gray-100 md:w-auto md:bg-transparent md:border-0 md:hover:bg-white hover:text-gray-900'
                  href={resolveUrlPath(
                    {
                      type: link.system.type,
                      urlSlug: link.elements.url.value,
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


export const FooterLinks: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive, setSmallMenuActive] = useState(false);
  const handleMenuClick = (menuId: string | number): void =>
    setActiveMenu(menuId === activeMenu ? -1 : menuId);

  return (
    <div className={`w-full fixed z-30 bg-white py-4 shadow-2xl`}>
      <div className='flex justify-between items-center mx-auto max-w-screen-xl md:h-16 pr-4'>
        <div className='w-screen h-full md:flex justify-between z-40 md:pr-24 xl:pr-12 2xl:pr-0'>
          <div className='flex h-full justify-between items-center '>
            <Link href='/' className='flex items-center max-h-full'></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

FooterLinks.displayName = 'FooterLinks';
