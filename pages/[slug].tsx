import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { FC, useEffect, useState } from "react";
import { AppPage } from "../components/shared/ui/appPage";
import { getAllPages, getDefaultMetadata, getHomepage, getItemByCodename, getItemByUrlSlug } from "../lib/services/kontent-service";
import { pageCodenames } from '../lib/routing';
import { ValidCollectionCodename } from "../lib/types/perCollection";
import { siteCodename } from "../lib/utils/env";
import { createElementSmartLink, createFixedAddSmartLink } from "../lib/utils/smartLinkUtils";
import { contentTypes, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot } from "../models";
import { RichTextElement } from "../components/shared/RichTextContent";
import { useSmartLink } from "../lib/useSmartLink";
import { KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes";

type Props = Readonly<{
  page: WSL_Page;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;  
  homepage: WSL_WebSpotlightRoot;
  isPreview: boolean;
  language: string;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}

const Page: NextPage<Props> = props => {
  const [page, setPage] = useState(props.page);

  const sdk = useSmartLink();

  useEffect(() => {
    const getPage = async () => {
      const response = await fetch(`/api/page?slug=${props.page.elements.url.value}&preview=${props.isPreview}&language=${props.language}`)
      const data = await response.json();

      setPage(data);
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      // setTimeout(function () {
        if (metadata.manualRefresh) {
          originalRefresh();
        } else {
          getPage();
        }
      // }, 2000);
    });
  }, [sdk, props.isPreview, props.language, props.page.elements.url.value]);
  
  return (<AppPage
    siteCodename={props.siteCodename}
    homeContentItem={props.homepage}
    defaultMetadata={props.defaultMetadata}
    item={page}
    pageType="WebPage"
  >
    <div
      {...createElementSmartLink(contentTypes.page.elements.content.codename)}
      {...createFixedAddSmartLink("end")}
    >
      <RichTextElement
                  element={page.elements.content}
                  isInsideTable={false}
                  language={props.language}
                />
    </div>
  </AppPage>
)
  };

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;
  if (!slug) {
    return {
      notFound: true
    }
  }

  const homepage = await getHomepage(!!context.preview, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);

  const page = await getItemByUrlSlug<WSL_Page>(slug, "url", !!context.preview, context.locale as string);
  if (!page) {
    return {
      notFound: true
    };
  };

  return {
    props: { page, siteCodename, defaultMetadata,  homepage, isPreview: !!context.preview, language: context.locale as string },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllPages(false);

  return {
    paths: pages.items.map(a => `/${a.elements.url.value}`),
    fallback: "blocking",
  };
}

export default Page;