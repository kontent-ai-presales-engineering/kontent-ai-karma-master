import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { AppPage } from '../../../components/shared/ui/appPage';
import {
  getDefaultMetadata,
  getCourseDetail,
  getCourseItemsWithSlugs,
} from '../../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../../lib/utils/env';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../../lib/utils/smartLinkUtils';
import {
  WSL_WebSpotlightRoot,
  contentTypes,
  Course,
  SEOMetadata,
} from '../../../models';
import { getHomepage } from '../../../lib/services/kontentClient';
import { RichTextElement } from '../../../components/shared/richText/RichTextElement';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';
import { formatDate } from '../../../lib/utils/dateTime';

type Props = Readonly<{
  course: Course;
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
  getCourseItemsWithSlugs({ envId: defaultEnvId }).then((courses) => ({
    paths: courses.map((course) => ({
      params: {
        slug: course.elements.url.value,
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

  const course = await getCourseDetail(
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

  if (!course) {
    return { notFound: true };
  }

  return {
    props: {
      course,
      siteCodename,
      defaultMetadata,
      isPreview: !!context.preview,
      language: context.locale as string,
      homepage: homepage,
    },
  };
};

const CourseDetail: FC<Props> = ({
  course,
  siteCodename,
  defaultMetadata,
  homepage,
  language,
  isPreview,
}) => (
  <AppPage
    item={course}
    siteCodename={siteCodename}
    homeContentItem={homepage}
    defaultMetadata={defaultMetadata}
    pageType='Course'
    isPreview={isPreview}
  >
    <figure
      className={`relative m-0 w-full h-[48rem]`}
      {...createItemSmartLink(course.system.id, course.system.codename)}
    >
      <Image
        src={course.elements.heroImage.value[0].url}
        alt={course.elements.heroImage.value[0].description}
        fill
        sizes='100vw, 100vh'
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-gradient-to-t from-slate-950 h-full flex flex-col items-center md:items-start justify-end px-6'>
        <div className={`py-5 px-3 max-w-screen-md md:w-fit text-left mb-4`}>
          <h1 className={`text-white m-0 text-4xl font-semibold mb-5`}>
            {course.elements.title.value}{' '}
            <span className='font-normal text-3xl'>
              {course.elements.courseType.value[0].name}
            </span>
          </h1>
          <p className='text-white text-2xl'>
            {course.elements.description.value}
          </p>
        </div>
        <div className={`bg-white/70 w-screen relative component_full-width`}>
          <div
            className={`flex flex-wrap mx-auto w-full max-w-screen-xl text-black justify-center`}
          >
            <div className='my-10 p-4 flex flex-col text-center sm:w-1/2 md:w-1/5'>
              <div className='font-bold text-3xl'>
                {course.elements.durationInYears.value}
              </div>
              <div>years</div>
            </div>
            <div className='my-10 p-4 flex flex-col text-center sm:w-1/2 md:w-1/5'>
              <div className='font-bold text-3xl'>
                {course.elements.enrollmentStatus.value[0].codename}
              </div>
              <div>time</div>
            </div>
            <div className='my-10 p-4 flex flex-col text-center sm:w-1/2 md:w-1/5'>
              <div className='font-bold text-3xl'>
                ${course.elements.feeIn.value}
              </div>
              <div>Current fee</div>
            </div>
            <div className='my-10 p-4 flex flex-col text-center sm:w-1/2 md:w-1/5'>
              <div className='font-bold text-3xl'>
                {course.elements.nextStartDate
                  ? formatDate(course.elements.nextStartDate.value)
                  : ''}{' '}
              </div>
              <div>Next start date</div>
            </div>
          </div>
        </div>
      </div>
    </figure>
    <div>
      <div
        {...createElementSmartLink(
          contentTypes.course.elements.overview.codename
        )}
      >
        <RichTextElement
          element={course.elements.overview}
          isInsideTable={false}
          language={language}
        />
        <div id='whyUs' className='bg-blue-200 py-1 px-5 flex'>
          <div className='md:w-1/6 pt-5'>
            <span className='text-3xl font-bold text-gray-500'>Why us?</span>
          </div>
          <div className='md:w-5/6'>
            <ul className='not-prose columns-2 list-disc text-black'>
              {course.elements.whyUs.linkedItems.map((i) => (
                <li
                  key={i.system.id}
                  className='text-black pr-3'
                  {...createItemSmartLink(i.system.id, i.system.name, true)}
                >
                  {
                    <RichTextElement
                      element={i.elements.content}
                      isInsideTable={false}
                      language={language}
                    />
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RichTextElement
          element={course.elements.body}
          isInsideTable={false}
          language={language}
        />
      </div>
    </div>
  </AppPage>
);

export default CourseDetail;
