import { FC, useEffect, useState } from 'react';
import { Event, EventListing } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { useSiteCodename } from './siteCodenameContext';
import { useRouter } from 'next/router';
import { EventItem } from '../listingPage/EventItem';

type Props = Readonly<{
  item: EventListing;
}>;

export const EventListingComponent: FC<Props> = (props) => {
  const isPreview = useRouter().isPreview;
  const router = useRouter();
  const siteCodename = useSiteCodename();
  const [totalCount, setTotalCount] = useState();
  const [events, setEvents] = useState<ReadonlyArray<Event> | undefined>();
  const categories = props.item.elements.eventType.value
    .map((term) => term.codename)
    .join(', ');

  useEffect(() => {
    const getEvents = async () => {
      const response = await fetch(
        `/api/events?preview=${isPreview}&category=${categories}&language=${router.locale}`
      );
      const newData = await response.json();
      setEvents(newData.events);
      setTotalCount(newData.totalCount);
    };
    getEvents();
  }, [isPreview, router.locale, categories]);

  return (
    <>
      <div
        className='prose w-full max-w-full py-4 mx-auto pb-24'
        {...createItemSmartLink(
          props.item.system.id,
          props.item.system.name,
          true
        )}
      >
        {props.item.elements.title?.value ? (
          <h3 className='heading'>{props.item.elements.title?.value}</h3>
        ) : (
          ''
        )}
        <div className='flex lg:flex-row flex-col gap-6'>
          {events?.map((event) => (
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
          ))}
        </div>
      </div>
    </>
  );
};

EventListingComponent.displayName = 'EventListingComponent';
