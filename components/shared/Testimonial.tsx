import { FC } from 'react';

import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { contentTypes, Testimonial } from '../../models';
import Image from 'next/image';

type Props = Readonly<{
  item: Testimonial;
}>;

export const TestimonialComponent: FC<Props> = (props) => {
  const authorItem = props.item.elements.author.linkedItems[0];
  const fullName =
    authorItem?.elements.firstName.value +
    ' ' +
    authorItem?.elements.lastName.value;
  return (
    <section
      className='w-screen relative component_full-width bg-gradient-to-tl from-slate-950 to-slate-400'
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
    >
      <div className='max-w-screen-xl px-4 py-6 mx-auto text-center lg:py-8 lg:px-6'>
        <figure className='max-w-screen-md mx-auto'>
          <svg
            className='h-12 mx-auto mb-3 text-white'
            viewBox='0 0 24 27'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z'
              fill='currentColor'
            />
          </svg>
          <blockquote>
            <p className='text-2xl font-medium text-gray-900 text-white'>
              {props.item.elements.quote.value}
            </p>
          </blockquote>
          <figcaption className='flex items-center justify-center mt-6 space-x-3'>
            <Image
              src={
                authorItem?.elements.photograph.value[0]?.url ??
                'missing author image url'
              }
              alt={`Avatar of author ${fullName}.`}
              width='80'
              height='80'
              className='w-20 h-20 rounded-full'
              {...createElementSmartLink(
                contentTypes.person.elements.photograph.codename,
                true
              )}
            />
            <div className='flex items-center divide-x-2 divide-white-500 divide-white'>
              <div
                className='pr-3 font-medium text-gray-900 text-white'
                {...createElementSmartLink(
                  contentTypes.person.elements.first_name.codename,
                  true
                )}
              >
                {' '}
                {fullName}
              </div>
              <div
                className='pl-3 text-sm font-light text-gray-500 text-white'
                {...createElementSmartLink(
                  contentTypes.person.elements.occupation.codename,
                  true
                )}
              >
                ({authorItem?.elements.occupation.value})
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
