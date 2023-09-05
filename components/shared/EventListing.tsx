import { FC, useEffect, useState } from "react";
import { Event, Block_EventListing } from "../../models";
import { createItemSmartLink } from "../../lib/utils/smartLinkUtils";
import { useSiteCodename } from "./siteCodenameContext";
import { useRouter } from "next/router";
import { EventItem } from "../listingPage/EventItem";

type Props = Readonly<{
  item: Block_EventListing;
}>;

export const EventListingComponent: FC<Props> = props => {
  const isPreview = useRouter().isPreview;
  const router = useRouter()
  const siteCodename = useSiteCodename();
  const [totalCount, setTotalCount] = useState();
  const [events, setEvents] = useState<ReadonlyArray<Event> | undefined>();
  const categories = props.item.elements.eventType.value.map(term => term.codename).join(", ")

  useEffect(() => {
    const getEvents = async () => {
      const response = await fetch(`/api/events?preview=${isPreview}&category=${categories}&language=${router.locale}`);
      const newData = await response.json();
      setEvents(newData.events);
      setTotalCount(newData.totalCount);
    }
    getEvents();
  }, [isPreview, router.locale, categories])

  return (
    <>
      <h2 className="m-0 mt-16">{props.item.elements.title?.value}</h2>
      <div className="prose w-full max-w-full py-4 "
        {...createItemSmartLink(props.item.system.id, props.item.system.name, true)}>
        {events?.map(a => (
          <EventItem
            key={a.system.id}
            title={a.elements.title.value}
            itemId={a.system.id}
            itemName={a.system.name}
            location={a.elements.eventLocation?.value}
            organizer={a.elements.organiser?.value}
            startDate={a.elements.startDateTime.value}
            endDate={a.elements.endDateTime?.value}
            locale={a.system.language}
            detailUrl={`/events/${a.elements.url.value}`}
          />
        ))}
      </div>
    </>
  );
}

EventListingComponent.displayName = "EventListingComponent";

