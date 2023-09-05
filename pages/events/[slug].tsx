import { GetStaticPaths, GetStaticProps } from "next";
import { FC, useEffect, useState } from "react";
import { RichTextElement } from "../../components/shared/RichTextContent";
import { AppPage } from "../../components/shared/ui/appPage";
import {  getAllEvents, getDefaultMetadata, getEventBySlug, getHomepage } from "../../lib/services/kontent-service";
import { ValidCollectionCodename } from "../../lib/types/perCollection";
import { siteCodename } from '../../lib/utils/env';
import { Event, SEOMetadata, WSL_Page, WSL_WebSpotlightRoot, contentTypes } from "../../models"
import { useSmartLink } from "../../lib/useSmartLink";
import { KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link/types/lib/IFrameCommunicatorTypes";
import { createElementSmartLink } from "../../lib/utils/smartLinkUtils";
import { EventItem } from "../../components/listingPage/EventItem";

type Props = Readonly<{
  event: Event;
  siteCodename: ValidCollectionCodename;
  defaultMetadata: SEOMetadata;
  siteMenu?: WSL_Page | null;
  homepage?: WSL_WebSpotlightRoot
  isPreview: boolean;
  language: string;
}>;

const EventPage: FC<Props> = props => {
  const [event, setEvent] = useState(props.event);

  const sdk = useSmartLink();

  useEffect(() => {
    const getEvent = async () => {
      const response = await fetch(`/api/event?slug=${props.event.elements.url.value}&preview=${props.isPreview}&language=${props.language}`)
      const data = await response.json();

      setEvent(data);
    }

    sdk?.on(KontentSmartLinkEvent.Refresh, (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      setTimeout(function () {
        if (metadata.manualRefresh) {
          originalRefresh();
        } else {
          getEvent();
        }
      }, 1000);
    });
  }, [sdk, props.isPreview, props.event.elements.url.value, props.language]);

  return (
    <AppPage
      siteCodename={props.siteCodename}
      homeContentItem={props.homepage}
      defaultMetadata={props.defaultMetadata}
      item={event}
      pageType="Event"
    >
      <div
        {...createElementSmartLink(contentTypes.event.elements.content.codename)}
      >
         <EventItem
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
        <RichTextElement
          element={event.elements.content}
          isInsideTable={false}
          language={props.language}
        />
      </div>
    </AppPage>
  );
};

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async context => {
  const slug = typeof context.params?.slug === "string" ? context.params.slug : "";

  if (!slug) {
    return { notFound: true };
  }

  const event = await getEventBySlug(slug, !!context.preview, context.locale as string);
  const defaultMetadata = await getDefaultMetadata(!!context.preview, context.locale as string);
  const homepage = await getHomepage(!!context.preview, context.locale as string);

  if (!event) {
    return { notFound: true };
  }

  return {
    props: {
      event,
      siteCodename,
      defaultMetadata,
      isPreview: !!context.preview,
      language: context.locale as string,
      homepage: homepage
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getAllEvents(false);
  return {
    paths: events.items.filter(item => item.elements.url?.value).map(a => `/events/${a.elements.url.value}`),
    fallback: "blocking",
  };
}

export default EventPage;
