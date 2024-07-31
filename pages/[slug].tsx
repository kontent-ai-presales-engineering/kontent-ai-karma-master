import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { AppPage } from '../components/shared/ui/appPage';
import {
  getItemByUrlSlug,
  getPagesSlugs,
} from '../lib/services/kontentClient';
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../lib/utils/env';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
} from '../lib/utils/smartLinkUtils';
import {
  contentTypes,
  Page,
} from '../models';
import { RichTextElement } from '../components/shared/richText/RichTextElement';
import {
  getPreviewApiKeyFromPreviewData,
} from '../lib/utils/pageUtils';
import { useLivePreview } from '../components/shared/contexts/LivePreview';
import KontentManagementService from '../lib/services/kontent-management-service';

type Props = Readonly<{
  page: Page;
  siteCodename: ValidCollectionCodename;
  isPreview: boolean;
  language: string;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
}

const Page: NextPage<Props> = ({
  page,
  siteCodename,
  isPreview,
  language,
}) => {
  const data = useLivePreview({
    page,
  });

  return <AppPage
    siteCodename={siteCodename}
    item={data.page}
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
  const envId = defaultEnvId;
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const page = await getItemByUrlSlug<Page>(
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
  return {
    props: {
      page,
      siteCodename,
      isPreview: !!context.preview,
      language: context.locale as string,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPagesSlugs({ envId: defaultEnvId });

  const paths = slugs
    .map((slug) => ({ params: { slug } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export default Page;