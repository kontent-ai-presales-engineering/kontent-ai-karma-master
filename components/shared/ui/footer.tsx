import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { Page, WSL_WebSpotlightRoot } from '../../../models';
import { useSiteCodename } from '../siteCodenameContext';
import { IContentItem } from '@kontent-ai/delivery-sdk';
import { ResolutionContext, resolveUrlPath } from '../../../lib/routing';
import { isMultipleChoiceOptionPresent } from '../../../lib/utils/element-utils';
import { perCollectionSEOTitle } from '../../../lib/constants/labels';

type Link = Readonly<Page>;

type Props = Readonly<{
  item: IContentItem;
  homeContentItem?: WSL_WebSpotlightRoot;
}>;

export const Footer: FC<Props> = (props) => {
  const siteCodename = useSiteCodename();
  const [activeMenu, setActiveMenu] = useState<string | number>(-1);
  const [smallMenuActive] = useState(false);
  const handleMenuClick = (menuId: string | number): void =>
    setActiveMenu(menuId === activeMenu ? -1 : menuId);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gradient-to-tl from-rose-950 to-manufacturing-dark w-screen py-8 text-white`}>
      <div className='flex items-center mx-auto max-w-screen-xl px-4'>
        <div className='w-screen h-full md:flex justify-between z-40 md:pr-24 xl:pr-12 2xl:pr-0'>
          <div className='flex flex-row w-full justify-center'>            
            <div>{perCollectionSEOTitle[siteCodename]}</div>
            <div className='border-l-2 border-r-2 pl-4 ml-4 pr-4 mr-4'>Copyright {currentYear}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'FooterMenu';