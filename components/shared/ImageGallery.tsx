import { FC } from "react";
import { useState } from 'react'
import { Elements } from "@kontent-ai/delivery-sdk";

type Props = Readonly<{
  images: Elements.AssetsElement;
}>;

export const ImageGalleryComponent: FC<Props> = props => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  return (
    <div className="-m-1 flex flex-wrap md:-m-2">
      <div className="flex w-1/2 flex-wrap">
        <div className="w-1/2 p-1 md:p-2">
          {props.images.value[0] &&
            <img
              alt={props.images.value[0].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[0].url} />
          }
        </div>
        <div className="w-1/2 p-1 md:p-2">
          {props.images.value[1] &&
            <img
              alt={props.images.value[1].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[1].url} />
          }
        </div>
        <div className="w-full p-1 md:p-2">
          {props.images.value[2] &&
            <img
              alt={props.images.value[2].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[2].url} />
          }
        </div>
      </div>
      <div className="flex w-1/2 flex-wrap">
        <div className="w-full p-1 md:p-2">
          {props.images.value[3] &&
            <img
              alt={props.images.value[3].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[3].url} />
          }
        </div>
        <div className="w-1/2 p-1 md:p-2">
          {props.images.value[4] &&
            <img
              alt={props.images.value[4].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[4].url} />
          }
        </div>
        <div className="w-1/2 p-1 md:p-2">
          {props.images.value[5] &&
            <img
              onClick={() => { setModalOpen(true) }}
              alt={props.images.value[5].description}
              className="block h-full w-full rounded-lg object-cover object-center"
              src={props.images.value[5].url} />
          }
        </div>
      </div>
    </div>
  );
}

ImageGalleryComponent.displayName = "ImageGalleryComponent";