import { FC, useState } from 'react';

import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { contentTypes, FAQ } from '../../models';
import { RichTextElement } from './richText/RichTextElement';

type Props = Readonly<{
  item: FAQ;
}>;

export const FaqAccordionComponent: FC<Props> = (props) => {
  const [active, setActive] = useState(null);
  const handleToggle = (index) => {
    active === index ? setActive(null) : setActive(index);
  };
  return (
    <div
      className='rounded-t-lg border border-slate-200 bg-white mb-2'
      {...createItemSmartLink(
        props.item.system.id,
        props.item.system.name,
        true
      )}
    >
      <h2 className='mb-0 mt-0' id='headingOne'>
        <button
          onClick={() => handleToggle(props.item.system.id)}
          className='group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)]'
          type='button'
          data-te-collapse-init
          data-te-target='#collapseOne'
          aria-expanded='true'
          aria-controls='collapseOne'
          {...createElementSmartLink(
            contentTypes.faq.elements.question.codename
          )}
        >
          {props.item.elements.question.value}
          <span className='mr-3 ml-auto h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none fill-blue-300 group-[[data-te-collapse-collapsed]]:fill-white'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className={
                active === props.item.system.id
                  ? 'h-6 w-6 rotate-180'
                  : 'h-6 w-6'
              }
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
              />
            </svg>
          </span>
        </button>
      </h2>
      <div
        className={`pt-0 overflow-hidden transition-[max-height] duration-500 ease-in ${
          active === props.item.system.id ? 'max-h-100' : 'max-h-0'
        }`}
        data-te-collapse-item
        data-te-collapse-show
        aria-labelledby='headingOne'
        data-te-parent='#accordionExample'
      >
        <div
          className='px-5 py-4'
          {...createElementSmartLink(contentTypes.faq.elements.answer.codename)}
        >
          <RichTextElement
            element={props.item.elements.answer}
            isInsideTable={false}
            language={props.item.system.language}
          />
        </div>
      </div>
    </div>
  );
};
