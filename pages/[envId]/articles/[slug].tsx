import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import { HeroImage } from '../../../components/landingPage/ui/heroImage';
import { RichTextElement } from '../../../components/shared/richText/RichTextElement';
import { AppPage } from '../../../components/shared/ui/appPage';
import { mainColorBgClass } from '../../../lib/constants/colors';
import {
  getAllArticles,
  getArticleBySlug,
  getDefaultMetadata,
  getHomepage,
} from '../../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { formatDate } from '../../../lib/utils/dateTime';
import { defaultEnvId, siteCodename } from '../../../lib/utils/env';
import {
  Article,
  SEOMetadata,
  WSL_Page,
  WSL_WebSpotlightRoot,
  contentTypes,
} from '../../../models';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../../lib/utils/smartLinkUtils';
import Image from 'next/image';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu?: WSL_Page | null;
  homepage?: WSL_WebSpotlightRoot;
  isPreview: boolean;
  language: string;
}>;

const ArticlePage: FC<Props> = (props) => {
  return (
    <AppPage
      siteCodename={props.siteCodename}
      homeContentItem={props.homepage}
      defaultMetadata={props.defaultMetadata}
      item={props.article}
      pageType='Article'
      isPreview={props.isPreview}
    >
      <HeroImage
        alt={
          props.article.elements.heroImage.value[0]?.description || 'Hero image'
        }
        url={props.article.elements.heroImage.value[0]?.url || ''}
        itemId={props.article.system.id}
        type={props.article.elements.heroImage.value[0]?.type}
      >
        <div
          className={`py-1 px-3 max-w-screen-md md:w-fit text-center mx-auto mb-4`}
        >
          <h1 className={`text-white m-0 text-3xl tracking-wide font-semibold`}>
            {props.article.elements.title.value}
          </h1>
        </div>
        <div className='bg-white opacity-90 p-4 rounded-lg mx-auto'>
          <p className='font-semibold'>
            {props.article.elements.abstract.value}
          </p>
        </div>
      </HeroImage>
      <div className='px-2 max-w-screen-lg m-auto md:px-20'>
        {props.article.elements.author.linkedItems[0] && (
          <div
            className='flex items-center'
            {...createItemSmartLink(
              props.article.elements.author.linkedItems[0].system.id,
              props.article.elements.author.linkedItems[0].system.name
            )}
          >
            <figure
              className='relative rounded-full w-20 h-20 overflow-hidden'
              {...createElementSmartLink(
                contentTypes.person.elements.photograph.codename,
                true
              )}
            >
              <Image
                src={
                  props.article.elements.author.linkedItems[0].elements
                    .photograph.value[0]?.url ?? 'missing author image url'
                }
                alt={`Avatar of author ${props.article.elements.author.linkedItems[0].elements.firstName.value}${props.article.elements.author.linkedItems[0].elements.lastName.value}.`}
                fill
                sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw'
                className='object-cover'
              />
            </figure>
            <div className='flex flex-col pl-4'>
              <span>
                <span
                  {...createElementSmartLink(
                    contentTypes.person.elements.first_name.codename,
                    true
                  )}
                >
                  {
                    props.article.elements.author.linkedItems[0].elements
                      .firstName.value
                  }
                </span>
                &nbsp;
                <span
                  {...createElementSmartLink(
                    contentTypes.person.elements.last_name.codename,
                    true
                  )}
                >
                  {
                    props.article.elements.author.linkedItems[0].elements
                      .lastName.value
                  }
                </span>
              </span>
              <em
                {...createElementSmartLink(
                  contentTypes.person.elements.occupation.codename,
                  true
                )}
              >
                {
                  props.article.elements.author.linkedItems[0].elements
                    .occupation.value
                }
              </em>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-2 my-12'>
          <div className='w-fit p-2 font-semibold'>
            {props.article.elements.publishingDate.value &&
              formatDate(props.article.elements.publishingDate.value)}
          </div>
          <div className='flex gap-2'>
            {props.article.elements.articleType.value.length > 0 &&
              props.article.elements.articleType.value.map((type) => (
                <div
                  key={type.codename}
                  className={`w-fit p-1 text-white ${
                    mainColorBgClass[props.siteCodename]
                  } rounded-full px-4`}
                >
                  {type.name}
                </div>
              ))}
          </div>
        </div>
        <RichTextElement
          element={props.article.elements.content}
          isInsideTable={false}
          language={props.language}
        />
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async (
  context
) => {
  const slug =
    typeof context.params?.slug === 'string' ? context.params.slug : '';

  if (!slug) {
    return { notFound: true };
  }

  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const article = await getArticleBySlug(
    { envId, previewApiKey },
    slug,
    !!context.preview,
    context.locale as string
  );
  const defaultMetadata = await getDefaultMetadata(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );
  const homepage = await getHomepage(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      article,
      siteCodename,
      defaultMetadata,
      isPreview: !!context.preview,
      language: context.locale as string,
      homepage: homepage,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles({ envId: defaultEnvId }, false);

  return {
    paths: articles.items.map((a) => ({
      params: {
        slug: a.elements.url.value,
        envId: defaultEnvId,
      },
    })),
    fallback: 'blocking',
  };
};

export default ArticlePage;
