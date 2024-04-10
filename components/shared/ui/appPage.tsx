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
import { parse } from 'node-html-parser';

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
  variants,
  item,
  defaultMetadata,
  isPreview }) => {
  const data = useLivePreview({
    item,
    defaultMetadata
  });

  const seoDetails = getSeoAndSharingDetails({
    page: item,
    url: process.env.NEXT_PUBLIC_DOMAIN + resolveUrlPath(
      {
        type: item.system.type,
        slug: item.elements.url?.value
      } as ResolutionContext,
      item.system.language),
    siteCodename: siteCodename,
  });

  return (
    <SiteCodenameProvider siteCodename={siteCodename}>
      <PageMetadata
        item={item}
        defaultMetadata={defaultMetadata}
        variants={variants}
      />
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
        {item.elements.hide.value.length === 0 || !item.elements.hide.value.find(hide => hide?.codename === "header") ? (
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
        {item.elements.hide.value.length === 0 || !item.elements.hide.value.find(hide => hide?.codename === "footer") ? (
          <Footer item={item} homeContentItem={homeContentItem} />
        ) : null}
      </div>
    </SiteCodenameProvider>
  );
};

AppPage.displayName = 'Page';

const PageMetadata: FC<
  Pick<Props, 'item' | 'defaultMetadata' | 'variants'>
> = ({ item, defaultMetadata, variants }) => {
  const pageMetaKeywords =
    item.elements.seoMetadataKeywords.value ||
    defaultMetadata?.elements?.seoMetadataKeywords.value;

  
  // Parse the openGraphMetadataOpengraphAdditionalTags value to create meta tags
  const root = parse(item.elements.openGraphMetadataOpengraphAdditionalTags.value);
  const metaTags = root.querySelectorAll('meta');

  return (
    <Head>
      <link rel='icon' href='/favicon.png' />
      {pageMetaKeywords &&
        <meta name='keywords' content={pageMetaKeywords} />
      }
      {variants?.map((variant, index) => (
        <link key={index} rel="alternate" hrefLang={variant.system.language} href={process.env.NEXT_PUBLIC_DOMAIN + resolveUrlPath(
          {
            type: variant.system.type,
            slug: variant.elements.url?.value
          } as ResolutionContext,
          variant.system.language)} />
      ))}
      {/* Render the parsed Open Graph meta tags */}
      {metaTags.map((tag, index) => (
        <meta key={index} {...tag.attributes} />
      ))}
    </Head>
  );
};
