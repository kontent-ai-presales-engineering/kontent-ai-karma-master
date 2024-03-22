import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { FC } from 'react';
import {
  getArticlesForListing, getEventsForListing, getHomepage,
} from '../../../lib/services/kontentClient';
import { ValidCollectionCodename } from '../../../lib/types/perCollection';
import { defaultEnvId, siteCodename } from '../../../lib/utils/env';
import {
  getEnvIdFromRouteParams,
  getPreviewApiKeyFromPreviewData,
} from '../../../lib/utils/pageUtils';
import { PreviewContext } from '../../../components/contexts/PreviewContext';
import { Event, taxonomies } from '../../../models';
import { EventItem } from '../../../components/listingPage/EventItem';
import { useSmartLink } from '../../../lib/useSmartLink';
import Image from 'next/image';

type Props = Readonly<{
  events: ReadonlyArray<Event> | undefined;
  siteCodename: ValidCollectionCodename;
  isPreview: boolean;
  language: string;
  logo?: string | undefined;
}>;

export const Products: FC<Props> = (props) => {
  useSmartLink();
  return <PreviewContext.Provider value={{ isPreview: props.isPreview }}>
    <div className="bg-[url('/assets/bg-display-panel.jpg')] bg-[length:1750px] bg-[-300px_top] bg-no-repeat w-[1250px] h-[1250px] m-auto pt-[150px]">
      <div className="container display-panel">
        <div className="w-[900px] h-[500px] m-auto p-[20px 25px 0 25px]">
          {props.logo && (
            <div className="logo-display-panel">
              <Image src={props.logo} alt="logo" height={300} />
            </div>
          )}
          {props.events.slice(0, 3).map((event, i) => {
            return <EventItem
              key={event.system.id}
              title={event.elements.title.value}
              itemId={event.system.id}
              itemName={event.system.name}
              location={event.elements.eventLocation?.value}
              organizer={event.elements.organiser?.value}
              startDate={event.elements.startDateTime.value}
              endDate={event.elements.endDateTime?.value}
              locale={event.system.language}
              detailUrl={`/events/${event.elements.url.value}`}
            />
          })}
          <div className="clear"></div>
        </div>
        <div className="clear"></div>
        <div className="display-panel-bottom">
        </div>
      </div>
      <div className="clear"></div>
    </div>
  </PreviewContext.Provider>
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const envId = getEnvIdFromRouteParams(context);
  const previewApiKey = getPreviewApiKeyFromPreviewData(context.previewData);

  const events = await getEventsForListing(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string,
    undefined,
    undefined
  );

  const homepage = await getHomepage(
    { envId, previewApiKey },
    !!context.preview,
    context.locale as string
  );

  return {
    props: {
      siteCodename,
      events: events.items,
      totalCount: events.pagination.totalCount ?? 0,
      isPreview: !!context.preview,
      language: context.locale as string,
      logo: homepage ? homepage?.elements.logo.value[0]?.url : ""
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { envId: defaultEnvId },
      },
    ],
    fallback: 'blocking',
  };
};

export default Products;