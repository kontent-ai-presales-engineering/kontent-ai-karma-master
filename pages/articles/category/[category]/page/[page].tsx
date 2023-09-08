import { GetStaticProps } from "next";
import { FC } from "react";
import { ArticlePageSize } from "../../../../../lib/constants/paging";
import { getArticleTaxonomy, getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getHomepage, getItemByCodename, getItemsTotalCount } from "../../../../../lib/services/kontent-service";
import { pageCodenames } from "../../../../../lib/routing";
import { ValidCollectionCodename } from "../../../../../lib/types/perCollection";
import { siteCodename } from "../../../../../lib/utils/env";
import { Article, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot } from "../../../../../models";
import ArticlesPage from "..";

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  page: WSL_Page,
  itemCount: number,
  defaultMetadata: SEOMetadata;  
  homepage?: WSL_WebSpotlightRoot
  isPreview: boolean;
  language: string;
}>;

const ArticlesPagingPage: FC<Props> = props => {
  return <ArticlesPage {...props} />
}

export const getStaticProps: GetStaticProps<Props> = async context => {  
  const pageCodename = pageCodenames.articles

  const pageURLParameter = context.params?.page;
  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  if (pageNumber < 0) {
    return { notFound: true }
  }

  const selectedCategory = context.params?.category as string;

  const articles = await getArticlesForListing(!!context.preview, context.locale as string, pageNumber, [selectedCategory]);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview, context.locale as string);
  const itemCount = await getArticlesCountByCategory(!!context.preview, selectedCategory, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);
  const homepage = await getHomepage(!!context.preview, context.locale as string);

  if (page === null || articles.items.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      articles: articles.items,
      siteCodename,
      page,
      itemCount,
      defaultMetadata,
      isPreview: !!context.preview, 
      language: context.locale as string, 
      homepage: homepage 
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  
  const getAllPagesForCategory = async (category: string) => {
    const totalCount = category === 'all' ? await getItemsTotalCount(false, 'article') : await getArticlesCountByCategory(false, category);
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map((_, index) => index + 1);
    return pages.map(pageNumber => ({
      params: { page: pageNumber.toString(), category },
    }));
  };
  
  const articleCategories = await getArticleTaxonomy(true);

  const paths = await Promise.all(articleCategories.map(category => getAllPagesForCategory(category.codename)))
    .then(categoryPaths => categoryPaths.flat());

  return {
    paths,
    fallback: 'blocking',
  };
};

export default ArticlesPagingPage;
