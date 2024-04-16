import Head from 'next/head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { AppPage } from '../../components/shared/ui/appPage';
import {
  getDefaultMetadata,
  getHomepage,
  getItemByUrlSlug,
  getLanguages,
  getPagesSlugs,
} from '../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../lib/utils/env';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
} from '../../lib/utils/smartLinkUtils';
import {
  contentTypes,
  SEOMetadata,
  WSL_Page,
  WSL_WebSpotlightRoot,
} from '../../models';
import { RichTextElement } from '../../components/shared/richText/RichTextElement';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../lib/utils/pageUtils';
import { reservedListingSlugs } from '../../lib/routing';
import { useLivePreview } from '../../components/shared/contexts/LivePreview';
import KontentManagementService from '../../lib/services/kontent-management-service';
import { IContentItem } from '@kontent-ai/delivery-sdk';

type Props = Readonly<{
  page: WSL_Page;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  variants: IContentItem[];
  homepage: WSL_WebSpotlightRoot;
  isPreview: boolean;
  language: string;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
}

const Page: NextPage<Props> = ({
                                 page,
                                 siteCodename,
                                 defaultMetadata,
                                 variants,
                                 homepage,
                                 isPreview,
                                 language,
                               }) => {
  const data = useLivePreview({
    page,
    defaultMetadata,
  });

  return page.elements.brandThemeChoice?.value?.[0]?.codename !== "clean" ? (
      <AppPage
        siteCodename={siteCodename}
        homeContentItem={homepage}
        defaultMetadata={data.defaultMetadata}
        item={data.page}
        variants={variants}
        pageType='WebPage'
        isPreview={isPreview}
      >
        <div
          {...createElementSmartLink(contentTypes.page.elements.content.codename)}
          {...createFixedAddSmartLink('end')}
        >
          <RichTextElement
            element={data.page.elements.content}
            isInsideTable={false}
            language={language}
          />
        </div>
      </AppPage>
  );
};

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps<Props, IParams> = async (
  context
) => {
  const slug = context.params?.slug;
  if (!slug) {
    return {
      notFound: true,
    };
  }
  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const homepage = await getHomepage(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );

  const defaultMetadata = await getDefaultMetadata(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );

  const page = await getItemByUrlSlug<WSL_Page>(
    { envId, previewApiKey },
    slug,
    'url',
    !!context.preview,
    context.locale as string
  );
  if (!page) {
    return {
      notFound: true,
    };
  }

  //Get variant for HREFLang tags 
  const kms = new KontentManagementService()
  const variants = (await kms.getLanguageVariantsOfItem({ envId, previewApiKey }, page.system.id, !!context.preview))
  return {
    props: {
      page,
      siteCodename,
      defaultMetadata,
      variants,
      homepage,
      isPreview: !!context.preview,
      language: context.locale as string,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPagesSlugs({ envId: defaultEnvId });

  const paths = slugs
    .filter((item) => item != reservedListingSlugs.articles)
    .filter((item) => item != reservedListingSlugs.products)
    .filter((item) => item != reservedListingSlugs.courses)
    .map((slug) => ({ params: { envId: defaultEnvId, slug } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export default Page;
