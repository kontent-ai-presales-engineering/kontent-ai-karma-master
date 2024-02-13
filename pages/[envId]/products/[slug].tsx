import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { AppPage } from '../../../components/shared/ui/appPage';
import {
  getDefaultMetadata,
  getProductDetail,
  getProductItemsWithSlugs,
} from '../../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../../lib/utils/env';
import { createElementSmartLink } from '../../../lib/utils/smartLinkUtils';
import {
  WSL_WebSpotlightRoot,
  contentTypes,
  Product,
  SEOMetadata,
} from '../../../models';
import { getHomepage } from '../../../lib/services/kontentClient';
import { RichTextElement } from '../../../components/shared/richText/RichTextElement';
import {
  mainColorBgClass,
  mainColorTextClass,
  mainColorHoverClass,
} from '../../../lib/constants/colors';
import Link from 'next/link';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';
import { useLivePreview } from '../../../components/shared/contexts/LivePreview';

type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  homepage: WSL_WebSpotlightRoot;
  language: string;
  isPreview: boolean;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = () =>
  getProductItemsWithSlugs({ envId: defaultEnvId }).then((products) => ({
    paths: products.map((product) => ({
      params: {
        slug: product.elements.url.value,
        envId: defaultEnvId,
      },
    })),
    fallback: 'blocking',
  }));

export const getStaticProps: GetStaticProps<Props, IParams> = async (
  context
) => {
  const slug = context.params?.slug;
  const language = context.locale as string;
  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  if (!slug) {
    return { notFound: true };
  }

  const product = await getProductDetail(
    { envId, previewApiKey },
    slug,
    !!context.preview,
    language
  );
  const defaultMetadata = await getDefaultMetadata(
    { envId, previewApiKey },
    !!context.preview,
    language
  );
  const homepage = await getHomepage(
    { envId, previewApiKey },
    !!context.preview,
    language
  );

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      siteCodename,
      defaultMetadata,
      isPreview: !!context.preview,
      language: context.locale as string,
      homepage: homepage,
    },
  };
};

const widthLimit = 400;

const ProductDetail: FC<Props> = ({
  product,
  siteCodename,
  defaultMetadata,
  homepage,
  language,
  isPreview,
}) => {
  
  const data = useLivePreview({
    product,
    defaultMetadata,
  });

  return (
  <AppPage
    item={data.product}
    siteCodename={siteCodename}
    homeContentItem={homepage}
    defaultMetadata={data.defaultMetadata}
    pageType='Product'
    isPreview={isPreview}
  >
    <div className='lg:w-3/4 lg:mx-auto'>
      <div className='flex flex-col md:flex-row'>
        <div className='md:w-1/3'>
          <div
            className='md:mr-10 max-w-full'
            {...createElementSmartLink(
              contentTypes.product.elements.product_image.codename
            )}
          >
            {product.elements.productImage.value[0] && (
              <Image
                src={product.elements.productImage.value[0].url}
                alt={
                  product.elements.productImage.value[0].description ||
                  product.elements.productImage.value[0].url.split('/').pop() ||
                  'Product image'
                }
                width={widthLimit}
                height={product.elements.productImage.value[0].height || 200}
                className='object-cover m-0 rounded-lg mb-10 md:mb-0'
                priority
              />
            )}
          </div>
        </div>
        <div className='md:w-2/3'>
          {' '}
          <h1
            className='font-normal'
            {...createElementSmartLink(
              contentTypes.product.elements.title.codename
            )}
          >
            {product.elements.title.value}
          </h1>
          <blockquote className='mb-3 text-gray-500 text-gray-400'>
            <RichTextElement
              element={product.elements.description}
              isInsideTable={false}
              language={language}
            />
          </blockquote>
          {product.system.codename ? (
            <Link
              href={`/html/productsheet.html?product=${product.system.codename}`}
              target='_blank'
            >
              <button
                className={`${mainColorBgClass[siteCodename]} ${mainColorTextClass[siteCodename]} ${mainColorHoverClass[siteCodename]} font-bold py-3 px-8 m-3 rounded duration-100 hover:scale-105 hover:drop-shadow mt-8`}
              >
                Download datasheet
              </button>
            </Link>
          ) : (
            <p className='border-l-4 pl-4 mt-16 italic mt-8'>
              Datasheet coming soon
            </p>
          )}
        </div>
      </div>
      <div className='mt-8 pt-8 border-t-2'>
        <div
          {...createElementSmartLink(
            contentTypes.product.elements.description.codename
          )}
        >
          <p>
            <strong>Product Summary:</strong>
          </p>
          <RichTextElement
            element={product.elements.body}
            isInsideTable={false}
            language={language}
          />
        </div>
      </div>
    </div>
  </AppPage>
)};

export default ProductDetail;
