import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useLivePreview } from '../../components/shared/contexts/LivePreview';
import { AppPage } from '../../components/shared/ui/appPage';
import {
  getDefaultMetadata,
  getHomepage,
} from '../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../lib/utils/env';
import { RichTextElement } from '../../components/shared/richText/RichTextElement';
import { SEOMetadata, WSL_WebSpotlightRoot, contentTypes } from '../../models';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
} from '../../lib/utils/smartLinkUtils';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../lib/utils/pageUtils';

type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
  isPreview: boolean;
  language: string;
  defaultMetadata: SEOMetadata;
}>;

const Home: NextPage<Props> = ({
  homepage,
  siteCodename,
  defaultMetadata,
  isPreview,
  language}) => {
  const data = useLivePreview({
      homepage,
      defaultMetadata,
  });

  return (
    <AppPage
      item={homepage}
      siteCodename={siteCodename}
      homeContentItem={homepage}
      pageType='WebPage'
      defaultMetadata={defaultMetadata}
      isPreview={isPreview}
    >
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink('end')}
      >
        <RichTextElement
          element={data.homepage.elements.content}
          isInsideTable={false}
          language={language}
        />
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
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
  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: {
      homepage,
      siteCodename,
      isPreview: !!context.preview,
      language: context.locale as string,
      defaultMetadata,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    {
      params: { envId: defaultEnvId },
    },
  ],
  fallback: 'blocking',
});

export default Home;
