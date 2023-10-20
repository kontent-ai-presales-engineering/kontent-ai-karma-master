import { FC, ReactNode } from 'react';
import Image from 'next/image';
import { createItemSmartLink } from '../../../lib/utils/smartLinkUtils';

type Props = Readonly<{
  url: string;
  alt: string;
  children: ReactNode;
  className?: string;
  itemId?: string;
  itemName?: string;
}>;

export const HeroImage: FC<Props> = (props) => (
  <figure
    className={`relative m-0 w-full h-[36rem] ${props.className ?? ''}`}
    {...createItemSmartLink(props.itemId, props.itemName)}
  >
    <Image
      src={props.url}
      alt={props.alt}
      fill
      sizes='100vw, 100vh'
      className='object-cover'
      priority
    />
    <div className='bg-gradient-to-t from-slate-950 relative h-full flex flex-col items-center md:items-start justify-end pb-16 px-6'>
      {props.children}
    </div>
  </figure>
);

HeroImage.displayName = 'HeroImage';
