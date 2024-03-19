import { GetStaticProps } from 'next';
import { FC, useCallback, useEffect, useState } from 'react';
import { ArticlePageSize } from '../../../../../../lib/constants/paging';
import {
  getArticleTaxonomy,
  getArticlesCountByCategory,
  getArticlesForListing,
  getDefaultMetadata,
  getHomepage,
  getItemBySlug,
  getItemsTotalCount,
} from '../../../../../../lib/services/kontentClient';
import {
  ResolutionContext,
  reservedListingSlugs,
  resolveUrlPath,
} from '../../../../../../lib/routing';
import { ValidCollectionCodename } from '../../../../../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../../../../../lib/utils/env';
import {
  Article,
  SEOMetadata,
  WSL_Page,
  WSL_WebSpotlightRoot,
  contentTypes,
} from '../../../../../../models';
import { NextRouter, useRouter } from 'next/router';
import Link from 'next/link';
import { AppPage } from '../../../../../../components/shared/ui/appPage';
import { useSiteCodename } from '../../../../../../components/shared/siteCodenameContext';
import { ITaxonomyTerms } from '@kontent-ai/delivery-sdk';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { ArticleItem } from '../../../../../../components/listingPage/ArticleItem';
import {
  mainColorBgClass,
  mainColorBorderClass,
  mainColorHoverClass,
} from '../../../../../../lib/constants/colors';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../../../../lib/utils/pageUtils';
import { useLivePreview } from '../../../../../../components/shared/contexts/LivePreview';

type Props = Readonly<{
  siteCodename: ValidCollectionCodename;
  articles: ReadonlyArray<Article>;
  page: WSL_Page;
  itemCount: number;
  defaultMetadata: SEOMetadata;
  homepage?: WSL_WebSpotlightRoot;
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
};

type FilterOptionProps = Readonly<{
  router: NextRouter;
}>;

const LinkButton: FC<LinkButtonProps> = (props) => (
  <Link
    scroll={false}
    href={
      props.disabled
        ? resolveUrlPath({
          type: 'article',
          term: 'all',
        })
        : props.href
    }
    className='h-full'
  >
    <button
      disabled={props.disabled}
      className={`${props.roundRight && 'rounded-r-lg'} ${props.roundLeft && 'rounded-l-lg'
        } disabled:cursor-not-allowed ${props.highlight
          ? `${mainColorBgClass[siteCodename]} text-white`
          : 'bg-white'
        } px-3 py-2 leading-tight text-gray-500 border disabled:bg-gray-200 border-gray-300 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 `}
    >
      {props.text}
    </button>
  </Link>
);

const FilterOptions: FC<FilterOptionProps> = ({ router }) => {
  const category = router.query.category;
  const [dropdownActive, setDropdownActive] = useState(false);
  const [taxonomies, setTaxonomies] = useState<ITaxonomyTerms[]>([]);
  const siteCodename = useSiteCodename();

  const getArticleCategories = useCallback(async () => {
    const response = await fetch(
      `/api/article-categories?preview=${router.isPreview}`
    );
    const articleCategories = await response.json();

    setTaxonomies(articleCategories);
  }, [router.isPreview]);

  useEffect(() => {
    getArticleCategories();
  }, [getArticleCategories]);

  return (
    <>
      <div className='md:hidden flex items-center mt-3'>
        <button
          type='button'
          className='w-screen flex items-center py-1 px-6'
          onClick={() => setDropdownActive(!dropdownActive)}
        >
          <ChevronDownIcon
            className={`w-6 h-full transform ${dropdownActive ? 'rotate-180' : ''
              }`}
          />
          <span className='font-semibold pb-1 pl-1'>Category</span>
        </button>
      </div>
      <div
        className={`${dropdownActive ? 'flex' : 'hidden'
          } absolute md:static w-full z-40 flex-col md:flex md:flex-row md:pt-10`}
      >
        {taxonomies.length > 0 &&
          taxonomies.map((taxonomy) => (
            <Link
              key={taxonomy.codename}
              href={resolveUrlPath({
                type: 'article',
                term: taxonomy.codename,
              } as ResolutionContext)}
              onClick={() => setDropdownActive(!dropdownActive)}
              scroll={false}
              className={`inline-flex items-center border z-10 md:justify-between md:mr-4 md:w-max px-6 py-1 no-underline hover:text-white  ${taxonomy.codename === category
                  ? [
                    mainColorBgClass[siteCodename],
                    mainColorBorderClass[siteCodename],
                    'text-white cursor-default',
                  ].join(' ')
                  : `border-gray-200 bg-white ${mainColorHoverClass[siteCodename]} cursor-pointer`
                } md:rounded-3xl`}
            >
              {taxonomy.name}
            </Link>
          ))}
        <Link
          href={resolveUrlPath({
            type: 'article',
            term: 'all',
          })}
          onClick={() => setDropdownActive(!dropdownActive)}
          scroll={false}
          className={`px-6 py-1 ${category === 'all' ? 'hidden' : ''
            } bg-gray-500 text-white no-underline font-bold md:rounded-3xl cursor-pointer`}
        >
          Clear
        </Link>
      </div>
    </>
  );
};

const ArticlesPagingPage: FC<Props> = ({
  siteCodename,
  articles,
  itemCount,
  defaultMetadata,
  homepage,
  page,
  isPreview,
  language
}) => {
  const router = useRouter();
  const currentpage =
    typeof router.query.page === 'string' ? +router.query.page : undefined;
  const category =
    typeof router.query.category === 'string' ? router.query.category : 'all';

  const data = useLivePreview({
    articles,
    defaultMetadata,
    page
  });

  const getFilteredArticles = () => {
    if (category === 'all') {
      return articles;
    } else {
      return data.articles.filter((article) =>
        article.elements.articleType?.value.some(
          (type) => type.codename === category
        )
      );
    }
  };

  const filteredArticles = getFilteredArticles();

  const pageCount = Math.ceil(itemCount / ArticlePageSize);

  return (
    <AppPage
      siteCodename={siteCodename}
      defaultMetadata={data.defaultMetadata}
      item={data.page}
      homeContentItem={homepage}
      pageType='WebPage'
      isPreview={isPreview}
    >
      <div className=''>
        <h1 className='mt-4 px-6 md:px-0 font-normal'>Latest Articles</h1>
        <FilterOptions router={router} />
        <div className='flex flex-col flex-grow min-h-[500px]'>
          {filteredArticles.length > 0 ? (
            <ul className='flex list-none gap-8 flex-wrap pl-0 mt-16'>
              {filteredArticles.map((article) => (
                <ArticleItem
                  key={article.system.id}
                  title={article.elements.title.value}
                  itemId={article.system.id}
                  itemName={article.system.name}
                  description={article.elements.abstract?.value}
                  imageUrl={article.elements.heroImage?.value[0]?.url || ''}
                  publishingDate={article.elements.publishingDate?.value}
                  detailUrl={resolveUrlPath({
                    type: 'article',
                    slug: article.elements.url.value,
                  })}
                />
              ))}
            </ul>
          ) : (
            <div className='w-full flex my-auto grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-4 pl-0 justify-center font-bold'>
              No articles match this criteria.
            </div>
          )}

          {pageCount > 1 && (
            <nav>
              <ul className='mr-14 sm:mr-0 flex flex-row flex-wrap list-none justify-center'>
                <li>
                  <LinkButton
                    text='Previous'
                    href={
                      !page || currentpage === 2
                        ? resolveUrlPath({
                          type: 'article',
                          term: 'all',
                        })
                        : resolveUrlPath({
                          type: 'article',
                          term: category,
                          page: currentpage - 1,
                        } as ResolutionContext)
                    }
                    disabled={currentpage === 1}
                    roundLeft
                  />
                </li>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <li key={i}>
                    <LinkButton
                      text={`${i + 1}`}
                      href={resolveUrlPath({
                        type: 'article',
                        term: category,
                        page: i + 1 > 1 ? i + 1 : undefined,
                      } as ResolutionContext)}
                      highlight={(page ?? 1) === i + 1}
                    />
                  </li>
                ))}
                <li>
                  <LinkButton
                    text='Next'
                    href={resolveUrlPath({
                      type: 'article',
                      term: category,
                      page: page ? currentpage + 1 : 2,
                    } as ResolutionContext)}
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
  );
};

export const getStaticPaths = async () => {
  const getAllPagesForCategory = async (category: string) => {
    const totalCount =
      category === 'all'
        ? await getItemsTotalCount(
          { envId: defaultEnvId },
          false,
          contentTypes.article.codename
        )
        : await getArticlesCountByCategory(
          { envId: defaultEnvId },
          false,
          category
        );
    const pagesNumber = Math.ceil((totalCount ?? 0) / ArticlePageSize);
    const pages = Array.from({ length: pagesNumber }).map(
      (_, index) => index + 1
    );
    return pages.map((pageNumber) => ({
      params: { page: pageNumber.toString(), category, envId: defaultEnvId },
    }));
  };

  const articleCategories = await getArticleTaxonomy(
    { envId: defaultEnvId }
  );

  const paths = await Promise.all(
    articleCategories.map((category) =>
      getAllPagesForCategory(category.codename)
    )
  ).then((categoryPaths) => categoryPaths.flat());

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const pageURLParameter = context.params?.page;
  const selectedCategory = context.params?.category as string;
  const pageNumber =
    !pageURLParameter || isNaN(+pageURLParameter) ? 1 : +pageURLParameter;

  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const articles = await getArticlesForListing(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string,
    pageNumber,
    [selectedCategory]
  );
  const page = await getItemBySlug<WSL_Page>(
    { envId, previewApiKey },
    reservedListingSlugs.articles,
    contentTypes.page.codename,
    !!context.preview,
    context.locale
  );
  const itemCount = await getArticlesCountByCategory(
    { envId, previewApiKey },
    !!context.preview,
    selectedCategory,
    context.locale as string
  );
  const defaultMetadata = await getDefaultMetadata(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );
  const homepage = await getHomepage(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );

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
      homepage: homepage,
    },
    revalidate: 10,
  };
};

export default ArticlesPagingPage;
