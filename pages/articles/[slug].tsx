import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import { HeroImage } from '../../components/landingPage/ui/heroImage';
import { RichTextElement } from '../../components/shared/richText/RichTextElement';
import { AppPage } from '../../components/shared/ui/appPage';
import { mainColorBgClass } from '../../lib/constants/colors';
import {
  getAllArticles,
  getArticleBySlug,
  getDefaultMetadata,
  getHomepage,
} from '../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../lib/types/perCollection';
import { formatDate } from '../../lib/utils/dateTime';
import { defaultEnvId, siteCodename } from '../../lib/utils/env';
import {
  Article,
  SEOMetadata,
  Page,
  WebSpotlightRoot,
  contentTypes,
} from '../../models';
import {
  createElementSmartLink,
  createItemSmartLink,
} from '../../lib/utils/smartLinkUtils';
import Image from 'next/image';
import {
  getPreviewApiKeyFromPreviewData,
} from '../../lib/utils/pageUtils';
import { useLivePreview } from '../../components/shared/contexts/LivePreview';
import KontentManagementService from '../../lib/services/kontent-management-service';
import { IContentItem } from '@kontent-ai/delivery-sdk';

type Props = Readonly<{
  article: Article;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  variants: IContentItem[];
  siteMenu?: Page | null;
  homepage?: WebSpotlightRoot;
  isPreview: boolean;
  language: string;
}>;

const ArticlePage: FC<Props> = ({
  article,
  siteCodename,
  defaultMetadata,
  variants,
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

  const TableOfContents = ({ htmlString }) => {
    // Use Cheerio to load and parse the HTML string
    const cheerio = require('cheerio');
    const $ = cheerio.load(htmlString);

    const extractedHeadings = $('h1, h2, h3, h4, h5, h6').map((_, heading) => {
      const text = $(heading).text();
      return {
        text,
        id: text.replace(/[^\w]/g, '_'),
        tagName: heading.tagName.toLowerCase(),
      };
    }).get();

    return (
      <>
        <style jsx>{`
          @media print {
            .toc {
              display: block !important;
            }
          }
        `}</style>
        <h1>Table of Contents</h1>
        <nav className="bg-gray-200 p-4 toc">
          <ul className="space-y-2">
            {extractedHeadings.map((heading, index) => (
              <li key={index}>
                <a href={`#${heading.id}`} className="text-blue-500 hover:text-blue-700">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </>)
  };

  const handleGeneratePdf = () => {
    const currentUrl = window.location.href;
    const pdfUrl = `/api/generate-pdf?url=${encodeURIComponent(currentUrl)}`;
    window.open(pdfUrl, '_blank');
  };

  return (
    <AppPage
      siteCodename={siteCodename}
      homeContentItem={homepage}
      defaultMetadata={data.defaultMetadata}
      variants={variants}
      item={data.article}
      pageType='Article'
      isPreview={isPreview}
    >
      <style jsx>{`
      @media print {
        .page-break {
          page-break-before: always;
        }
      }
    `}</style>
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
      <button
        onClick={handleGeneratePdf}
        className="print:hidden font-bold py-2 px-4 w-full text-right"
      >
        Generate Pdf 🖨️
      </button>
      <div className='px-2 max-w-screen-lg m-auto md:px-20 '>
        <div className='flex flex-col md:flex-row w-full mb-4 print:hidden'>
          <div className='w-3/4 mb-16 md:mb-0'>
            {' '}
            <div className='flex flex-col gap-2'>
              <div className='w-fit p-2 font-semibold'>
                {data.article.elements.publishingDate.value &&
                  formatDate(data.article.elements.publishingDate.value)}
              </div>
            </div>
          </div>
          <div className='w-1/4'>
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
        <div className='flex flex-col md:flex-row w-full print:hidden'>
          <div className='flex gap-2 flex-wrap'>
            {data.article.elements.articleType.value.length > 0 &&
              data.article.elements.articleType.value.map((type) => (
                <div
                  key={type.codename}
                  className={`w-fit p-1 text-white text-center ${mainColorBgClass[siteCodename]
                    } rounded-full px-4`}
                >
                  {type.name}
                </div>
              ))}
          </div>
        </div>
        <div className="page-break"></div>
        <div className="page-2 hidden print:block">
          <TableOfContents htmlString={data.article.elements.content.value} />
        </div>
        <div className="page-break"></div>
        <div className="page-3">
          <RichTextElement
            element={data.article.elements.content}
            isInsideTable={false}
            language={language}
          />
        </div>
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

  const envId = defaultEnvId;
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

  //Get HREFLang tags for SEO Metadata
  const kms = new KontentManagementService()
  const variants = (await kms.getLanguageVariantsOfItem({ envId, previewApiKey }, article.system.id, !!context.preview))

  return {
    props: {
      article,
      siteCodename,
      defaultMetadata,
      variants,
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
      },
    })),
    fallback: 'blocking',
  };
};

export default ArticlePage;