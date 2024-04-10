import Head from 'next/head';
import { FC, ReactNode } from 'react';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
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
import { ResolutionContext, resolveUrlPath } from '../../../lib/routing';
import { IContentItem } from '@kontent-ai/delivery-sdk';

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
  variants?: IContentItem[];
  pageType: 'WebPage' | 'Article' | 'Product' | 'FAQ' | 'Event' | 'Course';
  isPreview: boolean;
}>;

export const AppPage: FC<Props> = ({
  children,
  siteCodename,
  homeContentItem,
  item,
  defaultMetadata,
  isPreview }) => {
  const data = useLivePreview({
    item,
    defaultMetadata
  });

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
    <SiteCodenameProvider siteCodename={siteCodename}>
      <Head>        
        <link rel='icon' href='/favicon.png' />
        <meta name='keywords' content={pageMetaKeywords} />
      </Head>
      <NextSeo
        title={seoDetails.title}
        description={seoDetails.description}
        canonical={seoDetails.canonicalUrl}
        openGraph={seoDetails.openGraph}
        nofollow={seoDetails.nofollow}
        noindex={seoDetails.noindex}
      />
      <div className='flex justify-between'></div>
      <div
        className='min-h-full grow flex flex-col items-center overflow-hidden'
        {...createItemSmartLink(
          item.system.id,
          item.system.name
        )}
      >
        {item.elements.hide?.value?.length === 0 || !item.elements.hide?.value?.find(hide => hide?.codename === "header") ? (
          <Menu
            item={item}
            homeContentItem={homeContentItem}
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
        {item.elements.hide?.value?.length === 0 || !item.elements.hide?.value?.find(hide => hide?.codename === "footer") ? (
          <Footer item={item} homeContentItem={homeContentItem} />
        ) : null}
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = 'Page';

const PageMetadata: FC<
  Pick<Props, 'siteCodename' | 'item' | 'defaultMetadata' | 'variants' | 'pageType'>
> = ({ siteCodename, item, defaultMetadata, variants, pageType }) => {
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
      <meta name='description' content={seoDetails.description} />
      {variants?.map((variant, index) => (
        <link key={index} rel="alternate" hrefLang={variant.system.language} href={process.env.NEXT_PUBLIC_DOMAIN + resolveUrlPath(
          {
            type: variant.system.type,
            slug: variant.elements.url?.value
          } as ResolutionContext,
          variant.system.language)} />
      ))}
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