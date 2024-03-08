import { FC } from 'react';
import { YouTubeEmbed, contentTypes } from '../../models';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import { isMultipleChoiceOptionPresent } from '../../lib/utils/element-utils';
import { useState, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { RichTextElement } from './richText/RichTextElement';

type Props = Readonly<{
  item: YouTubeEmbed;
}>;

export const YouTubeMovieComponent: FC<Props> = (props) => {
  const params = new URLSearchParams({
    autoplay: isMultipleChoiceOptionPresent(
      props.item.elements.autoplay?.value,
      'yes'
    )
      ? '1'
      : '0',
    start: props.item.elements.startTime?.value
      ? props.item.elements.startTime?.value.toString()
      : '0',
    end: props.item.elements.endTime?.value
      ? props.item.elements.endTime?.value.toString()
      : '9999',
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumb = props.item.elements.image?.value[0]?.url;
  const thumbWidth = 768;
  const thumbHeight = 432;
  const thumbAlt = props.item.elements.image?.value[0]?.description;

  const video = (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${
        props.item.elements.youtube?.value
      }?${params.toString()}`}
      title='YouTube video player'
      className={
        !thumb
          ? `h-full w-full rounded-lg`
          : `w-full h-full`
      }
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
    ></iframe>
  );

  return (
    <div
      {...createItemSmartLink(props.item.system.id, props.item.system.name)}
      className='flex flex-row gap-4'
    >
      {thumb && (
        <>
          {/* Video thumbnail */}
          <div>
            <button
              className='relative flex justify-center items-center focus:outline-none focus-visible:ring focus-visible:ring-indigo-300 rounded-3xl group'
              onClick={() => {
                setModalOpen(true);
              }}
              aria-label='Watch the video'
            >
              <Image
                className='rounded-3xl shadow-2xl transition-shadow duration-300 ease-in-out'
                src={thumb}
                width={thumbWidth}
                height={thumbHeight}
                priority
                alt={thumbAlt as string}
              />
              {/* Play icon */}
              <svg
                className='absolute pointer-events-none group-hover:scale-110 transition-transform duration-300 ease-in-out'
                xmlns='http://www.w3.org/2000/svg'
                width='72'
                height='72'
              >
                <circle
                  className='fill-white'
                  cx='36'
                  cy='36'
                  r='36'
                  fillOpacity='.8'
                />
                <path
                  className='fill-indigo-500 drop-shadow-2xl'
                  d='M44 36a.999.999 0 0 0-.427-.82l-10-7A1 1 0 0 0 32 29V43a.999.999 0 0 0 1.573.82l10-7A.995.995 0 0 0 44 36V36c0 .001 0 .001 0 0Z'
                />
              </svg>
            </button>
            {/* End: Video thumbnail */}
          </div>
          <div className='w-1/2 py-4 flex flex-col justify-center pl-16'>
            <h2
              {...createElementSmartLink(
                contentTypes.youtube_embed.elements.title.codename
              )}
            >
              {props.item.elements.title?.value}
            </h2>
            <div
              className=''
              {...createElementSmartLink(
                contentTypes.youtube_embed.elements.body.codename
              )}
            >
              <RichTextElement
                element={props.item.elements.body}
                isInsideTable={false}
                language={props.item.system.language}
              />
            </div>
          </div>

          <Transition
            show={modalOpen}
            as={Fragment}
            afterEnter={() => videoRef.current?.play()}
          >
            <Dialog initialFocus={videoRef} onClose={() => setModalOpen(false)}>
              {/* Modal backdrop */}
              <Transition.Child
                className='fixed inset-0 z-[99999] bg-black bg-opacity-50 transition-opacity'
                enter='transition ease-out duration-200'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition ease-out duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
                aria-hidden='true'
              />
              {/* End: Modal backdrop */}

              {/* Modal dialog */}
              <Transition.Child
                className='fixed inset-0 z-[99999] flex px-4 md:px-6 py-6'
                enter='transition ease-out duration-300'
                enterFrom='opacity-0 scale-75'
                enterTo='opacity-100 scale-100'
                leave='transition ease-out duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-75'
              >
                <div className='max-w-5xl mx-auto h-full flex items-center'>
                  <Dialog.Panel className='max-h-full rounded-3xl shadow-2xl aspect-video bg-black overflow-hidden aspect-w-16 aspect-h-9 w-[1000px]'>
                    {video}
                    Your browser does not support the video tag.
                  </Dialog.Panel>
                </div>
              </Transition.Child>
              {/* End: Modal dialog */}
            </Dialog>
          </Transition>
        </>
      )}
      {!thumb && (
        <>
          <div
            className='aspect-video w-full'
          >
            {video}
          </div>
        </>
      )}
    </div>
  );
};

YouTubeMovieComponent.displayName = 'YouTubeMovieComponent';