import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { GetStaticProps } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { ArticleItem } from "../../../../components/listingPage/ArticleItem";
import { useSiteCodename } from "../../../../components/shared/siteCodenameContext";
import { AppPage } from "../../../../components/shared/ui/appPage";
import { mainColorBgClass, mainColorBorderClass, mainColorHoverClass } from "../../../../lib/constants/colors";
import { ArticlePageSize } from "../../../../lib/constants/paging";
import { getArticleTaxonomy, getArticlesCountByCategory, getArticlesForListing, getDefaultMetadata, getHomepage, getItemByCodename, getItemsTotalCount } from "../../../../lib/services/kontent-service";
import { pageCodenames } from "../../../../lib/routing";
import { ValidCollectionCodename } from "../../../../lib/types/perCollection";
import { siteCodename } from "../../../../lib/utils/env";
import { Article, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot } from "../../../../models";
import { ITaxonomyTerms } from "@kontent-ai/delivery-sdk";


type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  page: WSL_Page,
  itemCount: number;
  defaultMetadata: SEOMetadata;
  homepage?: WSL_WebSpotlightRoot
  isPreview: boolean;
  language: string;
}>;

type LinkButtonProps = {
  text: string;
  href: string;
  disabled?: boolean;
  roundRight?: boolean;
  roundLeft?: boolean;
  highlight?: boolean;
}

type FilterOptionProps = Readonly<{
  router: NextRouter;
}>;

const LinkButton: FC<LinkButtonProps> = props => {
  const siteCodename = useSiteCodename();

  return (
    <Link
      scroll={false}
      href={props.disabled ? '/articles' : props.href}
      className="h-full"
    >
      <button
        disabled={props.disabled}
        className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'} disabled:cursor-not-allowed ${props.highlight ? mainColorBgClass[siteCodename] : 'bg-white'} px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}
      >
        {props.text}
      </button>
    </Link>
  )
}

  const FilterOptions: FC<FilterOptionProps> = ({ router }) => {
    const category = router.query.category;
    const [dropdownActive, setDropdownActive] = useState(false);
    const [taxonomies, setTaxonomies] = useState<ITaxonomyTerms[]>([]);
    const siteCodename = useSiteCodename();

    const getArticleCategories = useCallback(async () => {
      const response = await fetch(`/api/article-categories?preview=${router.isPreview}`);
      const articleCategories = await response.json();

      setTaxonomies(articleCategories);
    }, [router.isPreview])


    useEffect(() => {
      getArticleCategories();
    }, [getArticleCategories])

    return (
      <>
        <div className="md:hidden flex items-center mt-3">
          <button
            type="button"
            className="w-screen flex items-center py-1 px-6"
            onClick={() => setDropdownActive(!dropdownActive)}
          >
            <ChevronDownIcon className={`w-6 h-full transform ${dropdownActive ? "rotate-180" : ""}`} />
            <span className="font-semibold pb-1 pl-1">Category</span>
          </button>
        </div>
        <div
          className={`${dropdownActive ? "flex" : "hidden"} absolute md:static w-full z-10 flex-col md:flex md:flex-row md:pt-10`}
        >
          {taxonomies.map(taxonomy => (
            <Link
              key={taxonomy.codename}
              href={`/articles/category/${taxonomy.codename}`}
              onClick={() => setDropdownActive(!dropdownActive)}
              scroll={false}
              className={`inline-flex items-center z-10 md:justify-between md:mr-4 md:w-max px-6 py-1 no-underline ${taxonomy.codename === category ? [mainColorBgClass[siteCodename], mainColorBorderClass[siteCodename], "cursor-default"].join(" ") : `border-gray-200 bg-white ${mainColorHoverClass[siteCodename]} cursor-pointer`} md:rounded-3xl`}
            >{taxonomy.name}
            </Link>
          ))}
          <Link
            href="/articles"
            onClick={() => setDropdownActive(!dropdownActive)}
            scroll={false}
            className={`px-6 py-1 ${category === "all" ? "hidden" : ""} bg-gray-500 text-white no-underline font-bold md:rounded-3xl cursor-pointer`}
          >Clear
          </Link>
        </div>
      </>
    );
};

const ArticlesPage: FC<Props> = props => {
  const router = useRouter();
  const page = typeof router.query.page === 'string' ? +router.query.page : undefined;
  const category = typeof router.query.category === 'string' ? router.query.category : "all";
  
  const getFilteredArticles = () => {
    if (category === 'all') {
      return props.articles;
    } else {
      return props.articles.filter(
        article => article.elements.articleType?.value.some(type => type.codename === category)
      );
    }
  };

  const filteredArticles = getFilteredArticles();
  const pageCount = Math.ceil(props.itemCount / ArticlePageSize);

  const createPagingButtonLink = (pageNumber: number) => {
    if (pageNumber > 1) {
      return `/articles/category/${category}/page/${pageNumber}`
    }

    return category === 'all' ? '/articles' : `/articles/category/${category}`
  }

  return (
    <AppPage
      siteCodename={props.siteCodename}
      defaultMetadata={props.defaultMetadata}
      item={props.page}
      homeContentItem={props.homepage}
      pageType="WebPage"
    >
      <div className="md:px-4">
        <h2 className="mt-4 px-6 md:px-0 md:mt-16">Laatste artikelen</h2>
        <FilterOptions
          router={router}
        />
        <div className="flex flex-col flex-grow min-h-[500px]">
          {filteredArticles.length > 0 ? (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 place-items-center list-none gap-5 md:pt-4 pl-0 justify-center">
              {filteredArticles.map(article => (
                <ArticleItem
                  key={article.system.id}
                  title={article.elements.title.value}
                  itemId={article.system.id}
                  description={article.elements.abstract?.value}
                  imageUrl={article.elements.heroImage?.value[0]?.url || ""}
                  publisingDate={article.elements.publishingDate?.value}
                  detailUrl={`/articles/${article.elements.url.value}`}
                />
              ))}
            </ul>
          )
            :
            <div className="w-full flex my-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-4 pl-0 justify-center font-bold">No articles match this criteria.</div>
          }

          {pageCount > 1 && (
            <nav>
              <ul className="mr-14 sm:mr-0 flex flex-row flex-wrap list-none justify-center">
                <li>
                  <LinkButton
                    text="Previous"
                    href={createPagingButtonLink((page ?? 0) - 1)}
                    disabled={!page}
                    roundLeft
                  />

                </li>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <li key={i}>
                    <LinkButton
                      text={`${i + 1}`}
                      href={createPagingButtonLink(i + 1)}
                      highlight={(page ?? 1) === i + 1}
                    />
                  </li>
                ))}
                <li>
                  <LinkButton
                    text="Next"
                    href={`/articles/category/${category}/page/${page ? page + 1 : 2}`}
                    disabled={(page ?? 1) === pageCount}
                    roundRight
                  />
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </AppPage>
  )
}

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

export const getStaticProps: GetStaticProps<Props> = async context => {
  const pageCodename = pageCodenames.articles;
  const pageURLParameter = context.params?.page;
  const selectedCategory = context.params?.category as string;

  const pageNumber = !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;
  const articles = await getArticlesForListing(!!context.preview, context.locale as string, pageNumber, [selectedCategory]);
  const page = await getItemByCodename<WSL_Page>(pageCodename, !!context.preview, context.locale as string);
  const itemCount = await getArticlesCountByCategory(!!context.preview, selectedCategory, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);
  const homepage = await getHomepage(!!context.preview, context.locale as string);

  if (page === null) {
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

export default ArticlesPage;
