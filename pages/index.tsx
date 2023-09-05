import { KontentSmartLinkEvent } from '@kontent-ai/smart-link';
import { IRefreshMessageData, IRefreshMessageMetadata } from '@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes';
import { GetStaticProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { AppPage } from '../components/shared/ui/appPage';
import { getDefaultMetadata, getHomepage } from "../lib/services/kontent-service";
import { ValidCollectionCodename } from '../lib/types/perCollection';
import { useSmartLink } from '../lib/useSmartLink';
import { siteCodename } from '../lib/utils/env';
import { RichTextElement } from '../components/shared/RichTextContent';
import { SEOMetadata, WSL_WebSpotlightRoot, contentTypes } from '../models';
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink } from '../lib/utils/smartLinkUtils';

type Props = Readonly<{
  homepage: WSL_WebSpotlightRoot;
  siteCodename: ValidCollectionCodename;
  isPreview: boolean;
  language: string;
  defaultMetadata: SEOMetadata;
}>;

const Home: NextPage<Props> = props => {
  const [homepage, setHomepage] = useState(props.homepage);

  const sdk = useSmartLink();

  useEffect(() => {
    const getHomepage = async () => {
      const response = await fetch(`/api/homepage?preview=${props.isPreview}&language=${props.language}`)
      const data = await response.json();

      setHomepage(data);
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      setTimeout(function () {
        if (metadata.manualRefresh) {
          originalRefresh();
        } else {
          getHomepage();
        }
      }, 1000);
    });
  }, [sdk, props.isPreview, props.language]);

  return (
    <AppPage
      item={homepage}
      siteCodename={props.siteCodename}
      homeContentItem={homepage}
      pageType='WebPage'
      defaultMetadata={props.defaultMetadata}
    >
      <div
        {...createElementSmartLink(contentTypes.page.elements.content.codename)}
        {...createFixedAddSmartLink("end")}
      >
        <RichTextElement
          element={homepage.elements.content}
          isInsideTable={false}
          language={props.language}
        />
      </div>
    </AppPage>
  )
};

export const getStaticProps: GetStaticProps<Props> = async context => {
  const homepage = await getHomepage(!!context.preview, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);
  if (!homepage) {
    throw new Error("Can't find homepage item.");
  }

  return {
    props: { homepage, siteCodename, isPreview: !!context.preview, language: context.locale as string, defaultMetadata },
  };
}

export default Home
