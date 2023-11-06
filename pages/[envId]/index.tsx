import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import {
  IRefreshMessageData,
  IRefreshMessageMetadata,
} from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { AppPage } from '../../components/shared/ui/appPage';
import {
  getDefaultMetadata,
  getHomepage,
} from '../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../lib/types/perCollection';
import { useSmartLink } from '../../lib/useSmartLink';
import { defaultEnvId, siteCodename } from '../../lib/utils/env';
import { RichTextElement } from '../../components/shared/richText/RichTextElement';
import { SEOMetadata, WSL_WebSpotlightRoot, contentTypes } from '../../models';
import {
  createElementSmartLink,
  createFixedAddSmartLink,
  createItemSmartLink,
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

const Home: NextPage<Props> = (props) => {
  const [homepage, setHomepage] = useState(props.homepage);
  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage = async () => {
      const response = await fetch(
        `/api/homepage?preview=${props.isPreview}&language=${props.language}`
      );
      const data = await response.json();

      setHomepage(data);
    };

    sdk?.on(
      KontentSmartLinkEvent.Refresh,
      (
        data: IRefreshMessageData,
        metadata: IRefreshMessageMetadata,
        originalRefresh: () => void
      ) => {
        setTimeout(function () {
          if (metadata.manualRefresh) {
            originalRefresh();
          } else {
            getHomepage();
          }
        }, 1000);
      }
    );
  }, [sdk, props.isPreview, props.language]);

  return (
    <AppPage
      item={homepage}
      siteCodename={props.siteCodename}
      homeContentItem={homepage}
      pageType='WebPage'
      defaultMetadata={props.defaultMetadata}
      isPreview={props.isPreview}
    >
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink('end')}
      >
        <RichTextElement
          element={homepage.elements.content}
          isInsideTable={false}
          language={props.language}
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
