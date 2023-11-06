import { ITaxonomyTerms } from '@kontent-ai/delivery-sdk';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ProductItem } from '../../../components/listingPage/ProductItem';
import { AppPage } from '../../../components/shared/ui/appPage';
import { mainColorBgClass } from '../../../lib/constants/colors';
import { ProductsPageSize } from '../../../lib/constants/paging';
import {
  getDefaultMetadata,
  getHomepage,
  getItemByCodename,
  getItemBySlug,
  getProductsForListing,
} from '../../../lib/services/kontentClient';
import { reservedListingSlugs, resolveUrlPath } from '../../../lib/routing';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { changeUrlQueryString } from '../../../lib/utils/changeUrlQueryString';
import { defaultEnvId, siteCodename } from '../../../lib/utils/env';
import {
  Product,
  SEOMetadata,
  WSL_Page,
  WSL_WebSpotlightRoot,
  contentTypes,
} from '../../../models';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';

type Props = Readonly<{
  page: WSL_Page;
  products: ReadonlyArray<Product> | undefined;
  siteCodename: ValidCollectionCodename;
  totalCount: number;
  isPreview: boolean;
  defaultMetadata: SEOMetadata;
  homepage: WSL_WebSpotlightRoot;
  language: string;
}>;

type ProductListingProps = Readonly<{
  products: ReadonlyArray<Product> | undefined;
}>;

const createQueryStringUrl = (
  params: Record<string, string | string[] | undefined>
) => {
  const queryString = Object.entries(params)
    .map(([paramKey, paramValue]) => {
      if (!paramValue) {
        return undefined;
      }

      return typeof paramValue === 'string'
        ? `${paramKey}=${paramValue}`
        : paramValue.map((v) => `${paramKey}=${v}`).join('&');
    })
    .filter((p) => p !== undefined)
    .join('&');

  return Object.keys(params).length > 0 ? `?${queryString}` : '';
};

const ProductListing: FC<ProductListingProps> = (props) => {
  if (!props.products || props.products.length === 0) {
    return (
      <div className='self-center text-center w-full h-10 pt-2'>
        No products with specified criteria
      </div>
    );
  }

  return (
    <ul className='w-full min-h-full mt-4 m-0 md:mt-0 p-0 px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 list-none items-center md:justify-start gap-2'>
      {props.products.map((product) => (
        <ProductItem
          key={product.system.id}
          imageUrl={product.elements.productImage.value[0]?.url || ''}
          title={product.elements.title.value}
          detailUrl={resolveUrlPath({
            type: 'product',
            slug: product.elements.url.value,
          })}
          price={product.elements.price.value}
          category={product.elements.productCategory.value[0]?.name || ''}
          itemId={product.system.id}
        />
      ))}
    </ul>
  );
};

export const Products: FC<Props> = (props) => {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(props.totalCount);
  const [products, setProducts] = useState<ReadonlyArray<Product> | undefined>(
    props.products
  );
  const [taxonomies, setTaxonomies] = useState<ITaxonomyTerms[]>([]);
  const { page, category } = router.query;

  const pageNumber = useMemo(() => (!page || isNaN(+page) ? 1 : +page), [page]);

  const isLastPage = pageNumber * ProductsPageSize >= totalCount;

  const categories = useMemo(() => {
    if (!category) {
      return [];
    }
    if (typeof category === 'string') {
      return [category];
    }

    return category;
  }, [category]);

  const getProducts = useCallback(async () => {
    const { page, category } = router.query;
    const queryStringUrl = createQueryStringUrl({
      preview: props.isPreview.toString(),
      language: props.language,
      page,
      category,
    });
    const response = await fetch(`/api/products${queryStringUrl}`);
    const newData = await response.json();

    setProducts(newData.products);
    setTotalCount(newData.totalCount);
  }, [router.query, props.isPreview, props.language]);

  const getProductCategories = useCallback(async () => {
    const response = await fetch(
      `/api/product-categories?preview=${props.isPreview}`
    );
    const productCategories = await response.json();

    setTaxonomies(productCategories);
  }, [props.isPreview]);

  useEffect(() => {
    getProducts();
  }, [page, category, getProducts]);

  useEffect(() => {
    getProductCategories();
  }, [getProductCategories]);

  const onPreviousClick = () => {
    if (pageNumber === 2) {
      changeUrlQueryString(
        Object.fromEntries(
          Object.entries(router.query).filter(([name]) => name !== 'page')
        ),
        router
      );
    } else {
      changeUrlQueryString({ ...router.query, page: pageNumber - 1 }, router);
    }
  };

  const onNextClick = () => {
    changeUrlQueryString({ ...router.query, page: pageNumber + 1 }, router);
  };

  const renderFilterOption = (term: ITaxonomyTerms) => {
    const onCheckBoxClicked = (isChecked: boolean) => {
      const newCategories = isChecked
        ? [...categories, term.codename, ...term.terms.map((t) => t.codename)]
        : categories.filter(
            (c) =>
              c !== term.codename &&
              !term.terms.map((t) => t.codename).includes(c)
          );
      changeUrlQueryString(
        { category: newCategories, envId: router.query.envId },
        router
      );
    };

    return (
      <li key={term.codename} className='m-0 p-0'>
        <div className='flex flex-row items-center min-w-fit'>
          <input
            id={term.codename}
            type='checkbox'
            checked={categories.includes(term.codename)}
            onChange={(event) => onCheckBoxClicked(event.target.checked)}
            className='min-w-4 min-h-4 bg-gray-100 border-gray-300 rounded'
          />
          <label
            htmlFor={term.codename}
            className='ml-2 text-sm font-semibold whitespace-nowrap'
          >
            {term.name}
          </label>
        </div>
        {term.terms.length > 0 && (
          <ul className='list-none'>
            {term.terms.map((t) => renderFilterOption(t))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <AppPage
      siteCodename={props.siteCodename}
      homeContentItem={props.homepage}
      defaultMetadata={props.defaultMetadata}
      item={props.page}
      pageType='WebPage'
      isPreview={props.isPreview}
    >
      <h1 className='mt-4 px-6 md:px-0 md:mt-16'>
        {props.page.elements.title.value}
      </h1>
      <div className='flex flex-col md:flex-row mt-4 md:gap-2'>
        <div className={`flex flex-col p-4`}>
          <h4 className='m-0 py-2'>Category</h4>
          <ul className='m-0 min-h-full gap-2 p-0 list-none'>
            {taxonomies.length > 0 &&
              taxonomies.map((term) => renderFilterOption(term))}
          </ul>
        </div>
        <ProductListing products={products} />
      </div>
      <div className='mt-8 flex flex-row justify-center'>
        <button
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg enabled:hover:bg-gray-100 disabled:bg-gray-200 enabled:hover:text-gray-700'
          onClick={onPreviousClick}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <button
          className='inline-flex items-center ml-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg enabled:hover:bg-gray-100 disabled:bg-gray-200 enabled:hover:text-gray-700'
          onClick={onNextClick}
          disabled={isLastPage}
        >
          Next
        </button>
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const page = await getItemBySlug<WSL_Page>(
    { envId, previewApiKey },
    reservedListingSlugs.products,
    contentTypes.page.codename,
    !!context.preview,
    context.locale as string
  );
  const products = await getProductsForListing(
    { envId, previewApiKey },
    !!context.preview,
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
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      siteCodename,
      defaultMetadata,
      products: products.items,
      totalCount: products.pagination.totalCount ?? 0,
      isPreview: !!context.preview,
      language: context.locale as string,
      homepage: homepage,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { envId: defaultEnvId },
      },
    ],
    fallback: 'blocking',
  };
};

export default Products;
