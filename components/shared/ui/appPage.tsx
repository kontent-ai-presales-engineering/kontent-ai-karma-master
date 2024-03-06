import Head from 'next/head';
import { FC, ReactNode } from 'react';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { useSmartLink } from '../../../lib/useSmartLink';
import { createItemSmartLink } from '../../../lib/utils/smartLinkUtils';
import {
  Article,
  Event,
  Product,
  SEOMetadata,
  WSL_Page,
  WSL_WebSpotlightRoot,
  Course,
} from '../../../models';
import { SiteCodenameProvider } from '../siteCodenameContext';
import { Menu } from './menu';
import { Footer } from './footer';
import { getSeoAndSharingDetails } from '../../../lib/utils/seo-utils';
import { NextSeo } from 'next-seo';
import { useLivePreview } from '../contexts/LivePreview';

type AcceptedItem =
  | WSL_WebSpotlightRoot
  | Article
  | Product
  | WSL_Page
  | Event
  | Course;

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  homeContentItem?: WSL_WebSpotlightRoot;
  item: AcceptedItem;
  defaultMetadata: SEOMetadata;
  pageType: 'WebPage' | 'Article' | 'Product' | 'FAQ' | 'Event' | 'Course';
  isPreview: boolean;
}>;

export const AppPage: FC<Props> = ({
  children, 
  siteCodename, 
  homeContentItem, 
  item, 
  defaultMetadata, 
  pageType, 
  isPreview}) => {
  const data = useLivePreview({
    item,
    defaultMetadata
  });
  return (
    <SiteCodenameProvider siteCodename={siteCodename}>
      <PageMetadata
        item={item}
        pageType={pageType}
        defaultMetadata={defaultMetadata}
        siteCodename={siteCodename}
      />
      <div className='flex justify-between'></div>
      <div
        className='min-h-full grow flex flex-col items-center overflow-hidden'
        {...createItemSmartLink(
          item.system.id,
          item.system.name
        )}
      >
        {homeContentItem ? (
          <Menu
            item={item}
            homeContentItem={homeContentItem}
            isPreview={isPreview}
          />
        ) : (
          <span>
            Missing top navigation. Please provide a valid navigation item in
            the web spotlight root.
          </span>
        )}
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
        <Footer item={item} homeContentItem={homeContentItem} />
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = 'Page';

const PageMetadata: FC<
  Pick<Props, 'siteCodename' | 'item' | 'defaultMetadata' | 'pageType'>
> = ({ siteCodename, item, defaultMetadata, pageType }) => {
  const pageMetaKeywords =
    item.elements.seoMetadataKeywords.value ||
    defaultMetadata?.elements?.seoMetadataKeywords.value;
  const seoDetails = getSeoAndSharingDetails({
    page: item,
    url: '/',
    includeTitleSuffix: false,
    siteCodename: siteCodename,
  });
  return (
    <Head>
      <title>{seoDetails.title}</title>
      <NextSeo
        title={seoDetails.title}
        description={seoDetails.description}
        canonical={seoDetails.canonicalUrl}
        openGraph={seoDetails.openGraph}
        nofollow={seoDetails.nofollow}
        noindex={seoDetails.noindex}
      />
      <link rel='icon' href='/favicon.png' />
      <meta name='description' content={seoDetails.description} />
      <meta name='keywords' content={pageMetaKeywords} />
      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'http://schema.org',
          '@type': pageType,
          name:
            item.elements.seoMetadataTitle.value || item.elements.title.value,
          description: seoDetails.description,
          keywords: pageMetaKeywords,
        })}
      </script>
    </Head>
  );
};
