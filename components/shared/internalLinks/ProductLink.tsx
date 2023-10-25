import Image from "next/image";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react"

import { Product } from "../../../models";

type Props = Readonly<{
  children: ReactNode;
  itemCodename: string;
  slug: string;
}>;

export const ProductLink: FC<Props> = props => {
  const [product, setProduct] = useState<Product | null>(null);
  const isPreview = useRouter().isPreview;

  useEffect(() => {
    fetch(`/api/product?codename=${props.itemCodename}&preview=${isPreview}`)
      .then(res => res.json())
      .then(res => setProduct(res.product));
  }, [props.itemCodename, isPreview]);

  return (
    <span className="relative group/popoverTarget">
      <a
        href={`/products/${props.slug}`}
        className="text-red-300"
      >
        {props.children}
      </a>
      {product && (
        <Popover>
          <ProductPreview product={product} />
        </Popover>
      )}
    </span>
  )
};

type PopoverProps = Readonly<{
  children: ReactNode;
}>;

const Popover: FC<PopoverProps> = props => (
  <span className="block absolute bottom-full left-1/2 -translate-x-1/2 z-10 p-3 invisible group-hover/popoverTarget:visible">
    <span className="block border-gray-200 rounded-l p-5 drop-shadow-md bg-white w-max max-w-[200px]">
      {props.children}
    </span>
  </span>
);

type ProductPreviewProps = Readonly<{
  product: Product;
}>;

const ProductPreview: FC<ProductPreviewProps> = props => (
  <>
    <Image
      src={props.product.elements.productImage.value[0]?.url || ""}
      alt={props.product.elements.productImage.value[0]?.description || props.product.elements.title.value}
      height={200}
      width={props.product.elements.productImage.value[0]?.width || 200}
      className="object-contain"
    />
    <span className="block w-full h-0 border-gray-200 border-b-2 my-3" />
    <span className="flex justify-center">
      {props.product.elements.title.value}
    </span>
    <span className="flex justify-center">
      Price: {props.product.elements.price.value}€
    </span>
  </>
);
