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
  contentTypes,
} from '../../../models';
import { SiteCodenameProvider } from '../siteCodenameContext';
import { Menu } from './menu';
import { Footer } from './footer';
import { getSeoAndSharingDetails } from '../../../lib/utils/seo-utils';
import { NextSeo } from 'next-seo';
import { HeroUnitComponent } from '../HeroUnit';
import { CarouselComponent } from '../Carousel';

type AcceptedItem = WSL_WebSpotlightRoot | Article | Product | WSL_Page | Event;

type Props = Readonly<{
  children: ReactNode;
  siteCodename: ValidCollectionCodename;
  homeContentItem?: WSL_WebSpotlightRoot;
  item: AcceptedItem;
  defaultMetadata: SEOMetadata;
  pageType: 'WebPage' | 'Article' | 'Product' | 'FAQ' | 'Event';
  isPreview: boolean;
}>;

export const AppPage: FC<Props> = (props) => {
  useSmartLink();
  return (
    <SiteCodenameProvider siteCodename={props.siteCodename}>
      <PageMetadata
        item={props.item}
        pageType={props.pageType}
        defaultMetadata={props.defaultMetadata}
        siteCodename={props.siteCodename}
      />
      <div className='flex justify-between'></div>
      <div
        className='min-h-full grow flex flex-col items-center overflow-hidden'
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.codename
        )}
      >
        {props.homeContentItem ? (
          <Menu
            item={props.item}
            homeContentItem={props.homeContentItem}
            isPreview={props.isPreview}
          />
        ) : (
          <span>
            Missing top navigation. Please provide a valid navigation item in
            the web spotlight root.
          </span>
        )}
        <main
          className='py-14 md:py-20 md:px-4 sm:px-8 max-w-screen-xl grow h-full w-screen'
          {...createItemSmartLink(
            props.item.system.id,
            props.item.system.name,
            true
          )}
        >
          <div className='prose w-full max-w-full'>{props.children}</div>
        </main>
        <Footer item={props.item} homeContentItem={props.homeContentItem} />
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