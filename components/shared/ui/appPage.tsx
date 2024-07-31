import { FC, ReactNode } from 'react';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { createItemSmartLink } from '../../../lib/utils/smartLinkUtils';
import {
  WSL_Page,
  WSL_WebSpotlightRoot,
} from '../../../models';
import { SiteCodenameProvider } from '../siteCodenameContext';
import { Menu } from './menu';
import { Footer } from './footer';
import { useLivePreview } from '../contexts/LivePreview';

type AcceptedItem =
  | WSL_WebSpotlightRoot
  | WSL_Page;

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  item: AcceptedItem;
  pageType: 'WebPage';
  isPreview: boolean;
}>;

export const AppPage: FC<Props> = ({
  children,
  siteCodename,
  item,
  isPreview }) => {
  const data = useLivePreview({
    item,
  });

  return (
    <SiteCodenameProvider siteCodename={siteCodename}>
      <div className='flex justify-between'></div>
      <div
        className='min-h-full grow flex flex-col items-center overflow-hidden'
        {...createItemSmartLink(
          item.system.id,
          item.system.name
        )}
      >
        {item.elements.hide?.value.length === 0 || !item.elements.hide?.value.find(hide => hide?.codename === "header") ? (
          <Menu
            item={item}
            isPreview={isPreview}
          />
        ) : null}
        <main
          data-kontent-language-codename={item.system.language}
          className='py-24 md:px-6 px-3 sm:px-8 max-w-screen-xl grow h-full w-screen'
          {...createItemSmartLink(
            item.system.id,
            item.system.name,
            true
          )}
        >
          <div className='prose w-full max-w-full pt-16'>{children}</div>
        </main>
        {item.elements.hide?.value.length === 0 || !item.elements.hide?.value.find(hide => hide?.codename === "footer") ? (
          <Footer item={item} />
        ) : null}
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = 'Page';