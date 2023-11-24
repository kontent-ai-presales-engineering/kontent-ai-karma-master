import { FC, useEffect, useState } from 'react';
import { Product, ProductListing } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { useSiteCodename } from './siteCodenameContext';
import { useRouter } from 'next/router';
import { ProductItem } from '../listingPage/ProductItem';
import { resolveUrlPath } from '../../lib/routing';

type Props = Readonly<{
  item: ProductListing;
}>;

export const ProductListingComponent: FC<Props> = (props) => {
  const isPreview = useRouter().isPreview;
  const router = useRouter();
  const siteCodename = useSiteCodename();
  const [totalCount, setTotalCount] = useState();
  const [products, setProducts] = useState<
    ReadonlyArray<Product> | undefined
  >();
  const categories = props.item.elements.productCategory?.value
    ?.map((term) => term.codename)
    .join(', ');

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `/api/products?preview=${isPreview}&category=${categories}&language=${router.locale}`
      );
      const newData = await response.json();
      setProducts(newData.products);
      setTotalCount(newData.totalCount);
    };
    getProducts();
  }, [isPreview, router.locale, categories]);

  if (!products || products.length === 0) {
    return (
      <div className='self-center text-center w-full h-10 pt-2'>
        No products with specified criteria
      </div>
    );
  }
  return (
    <>
      <h2 className='m-0 mt-16'>{props.item.elements.title?.value}</h2>
      <ul className='w-full min-h-full mt-4 m-0 md:mt-0 p-0 px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 list-none items-center md:justify-start gap-2'>
        {products?.map((product) => (
          <ProductItem
            key={product.system.id}
            imageUrl={product.elements.productImage.value[0].url}
            title={product.elements.title.value}
            detailUrl={resolveUrlPath({
              type: 'product',
              slug: product.elements.url.value,
            })}
            price={product.elements.price.value}
            category={product.elements.productCategory.value[0]?.name}
            itemId={product.system.id}
            itemName={product.system.name}
          />
        ))}
      </ul>
    </>
  );
};

ProductListingComponent.displayName = 'ProductListingComponent';
