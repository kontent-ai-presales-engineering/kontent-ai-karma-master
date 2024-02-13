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
import { useLivePreview } from '../../../components/shared/contexts/LivePreview';

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu?: WSL_Page | null;
  homepage?: WSL_WebSpotlightRoot;
  isPreview: boolean;
  language: string;
}>;

const ArticlePage: FC<Props> = ({
  article,
  siteCodename,
  defaultMetadata,
  siteMenu,
  homepage,
  isPreview,
  language
}) => {
  const data = useLivePreview({
    siteMenu,
    article,
    defaultMetadata,
  })

  return (
    <AppPage
      siteCodename={siteCodename}
      homeContentItem={homepage}
      defaultMetadata={data.defaultMetadata}
      item={data.article}
      pageType='Article'
      isPreview={isPreview}
    >
      <HeroImage
        alt={
          article.elements.heroImage.value[0]?.description || 'Hero image'
        }
        url={article.elements.heroImage.value[0]?.url || ''}
        itemId={article.system.id}
        type={article.elements.heroImage.value[0]?.type}
      >
        <div
          className={`py-1 px-3 max-w-screen-md md:w-fit text-center mx-auto mb-4`}
        >
          <h1 className={`m-0 text-3xl tracking-wide font-semibold text-white`}>
            {data.article.elements.title.value}
          </h1>
        </div>
        <div className='text-white p-4 rounded-lg mx-auto'>
          <p className='font-semibold my-0'>
            {data.article.elements.abstract.value}
          </p>
        </div>
      </HeroImage>
      <div className='px-2 max-w-screen-lg m-auto md:px-20 '>
        <div className='flex flex-col md:flex-row w-full mb-16'>
          <div className='w-1/2 mb-16 md:mb-0'>
            {' '}
            <div className='flex flex-col gap-2'>
              <div className='w-fit p-2 font-semibold'>
                {data.article.elements.publishingDate.value &&
                  formatDate(data.article.elements.publishingDate.value)}
              </div>
              <div className='flex gap-2'>
                {data.article.elements.articleType.value.length > 0 &&
                  data.article.elements.articleType.value.map((type) => (
                    <div
                      key={type.codename}
                      className={`w-fit p-1 text-white ${
                        mainColorBgClass[siteCodename]
                      } rounded-full px-4`}
                    >
                      {type.name}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className='w-1/2'>
            {data.article.elements.author.linkedItems[0] && (
              <div
                className='flex items-center'
                {...createItemSmartLink(
                  data.article.elements.author.linkedItems[0].system.id,
                  data.article.elements.author.linkedItems[0].system.name
                )}
              >
                <figure
                  className='relative rounded-full w-20 h-20 overflow-hidden m-0'
                  {...createElementSmartLink(
                    contentTypes.person.elements.photograph.codename,
                    true
                  )}
                >
                  <Image
                    src={
                      data.article.elements.author.linkedItems[0].elements
                        .photograph.value[0]?.url ?? 'missing author image url'
                    }
                    alt={`Avatar of author ${data.article.elements.author.linkedItems[0].elements.firstName.value}${data.article.elements.author.linkedItems[0].elements.lastName.value}.`}
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
                        data.article.elements.author.linkedItems[0].elements
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
                        data.article.elements.author.linkedItems[0].elements
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
                      data.article.elements.author.linkedItems[0].elements
                        .occupation.value
                    }
                  </em>
                </div>
              </div>
            )}
          </div>
        </div>

        <RichTextElement
          element={data.article.elements.content}
          isInsideTable={false}
          language={language}
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
