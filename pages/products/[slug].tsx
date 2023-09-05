import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from 'querystring';
import { FC } from "react";
import { AppPage } from "../../components/shared/ui/appPage";
import { getDefaultMetadata, getProductDetail, getProductSlugs } from "../../lib/services/kontent-service";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from "../../lib/utils/env";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import { WSL_WebSpotlightRoot, contentTypes, Product, SEOMetadata } from "../../models"
import { getHomepage } from "../../lib/services/kontent-service";


type Props = Readonly<{
  product: Product;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  homepage: WSL_WebSpotlightRoot;
  language: string;
  isPreview: boolean;
}>;

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = () => {
  return getProductSlugs()
    .then(products => ({
      paths: products.map(product => `/products/${product.elements.url.value}`),
      fallback: 'blocking'
    }));
}

export const getStaticProps: GetStaticProps<Props, IParams> = async (context) => {
  const slug = context.params?.slug;
  const language = context.locale as string

  if (!slug) {
    return { notFound: true };
  }

  const product = await getProductDetail(slug, !!context.preview, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);
  const homepage = await getHomepage(!!context.preview, context.locale as string);

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
      homepage: homepage 
    }
  };
};

const widthLimit = 300;

const ProductDetail: FC<Props> = ({ product, siteCodename, defaultMetadata, homepage }) => (
  <AppPage
    item={product}
    siteCodename={siteCodename}
    homeContentItem={homepage}
    defaultMetadata={defaultMetadata}
    pageType="Product"
  >
    <div>
      <h1
        {...createElementSmartLink(contentTypes.product.elements.title.codename)}
      >
        {product.elements.title.value}
      </h1>
      <div {...createElementSmartLink(contentTypes.product.elements.product_image.codename)}>
        {
          product.elements.productImage.value[0] && (
            <Image
              src={product.elements.productImage.value[0].url}
              alt={product.elements.productImage.value[0].description || product.elements.productImage.value[0].url.split('/').pop() || "Product image"}
              width={widthLimit}
              height={product.elements.productImage.value[0].height || 200}
              className="object-cover"
              priority
            />
          )
        }
      </div>
      <div {...createElementSmartLink(contentTypes.product.elements.description.codename)}>
        {product.elements.description.value}
      </div>
    </div>
  </AppPage >
);

export default ProductDetail;
