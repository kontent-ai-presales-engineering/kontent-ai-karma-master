import { GetStaticPaths, GetStaticProps } from 'next';
import { FC } from 'react';
import {
  getAllBanners,
  getBannerBySlug,
} from '../../../lib/services/kontentClient';
import { defaultEnvId } from '../../../lib/utils/env';
import {
  ImageContainer,
} from '../../../models';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';
import { useLivePreview } from '../../../components/shared/contexts/LivePreview';
import { ImageContainerComponent } from '../../../components/shared/ImageContainer';

type Props = Readonly<{
  banner: ImageContainer;
}>;

const BannerPage: FC<Props> = ({
  banner
}) => {
  const data = useLivePreview({
    banner
  })

  return (
    <div className='min-h-full grow flex flex-col items-center overflow-hidden'>
      <main className='py-24 md:px-6 px-3 sm:px-8 max-w-screen-xl grow h-full w-screen'>
      <div className='prose w-full max-w-full pt-16'>
        <ImageContainerComponent item={data.banner} personalized={false}  />
      </div>
      </main>
    </div>
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

  const banner = await getBannerBySlug(
    { envId, previewApiKey },
    slug,
    !!context.preview,
    context.locale as string
  );

  if (!banner) {
    return { notFound: true };
  }

  return {
    props: {
      banner
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllBanners({ envId: defaultEnvId }, false);

  return {
    paths: articles.items.map((a) => ({
      params: {
        slug: a.system.codename,
        envId: defaultEnvId,
      },
    })),
    fallback: 'blocking',
  };
};

export default BannerPage;
