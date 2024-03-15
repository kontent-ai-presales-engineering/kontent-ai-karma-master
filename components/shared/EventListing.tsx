import { FC, useEffect, useState, useMemo } from 'react';
import { Event, EventListing } from '../../models';
import { createItemSmartLink } from '../../lib/utils/smartLinkUtils';
import { useRouter } from 'next/router';
import { EventItem } from '../listingPage/EventItem';

type Props = Readonly<{
  item: EventListing;
}>;

const fetchEvents = async (isPreview, categories, locale) => {
  try {
    const response = await fetch(
      `/api/events?preview=${isPreview}&category=${categories}&language=${locale}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return { events: [], totalCount: 0 };
  }
};

export const EventListingComponent: FC<Props> = ({ item }) => {
  const { isPreview, locale } = useRouter();
  const [data, setData] = useState<{ events: ReadonlyArray<Event> | undefined; totalCount: number | undefined }>({ events: undefined, totalCount: undefined });

  const categories = useMemo(() => item.elements.eventType?.value?.map((term) => term.codename).join(', ') || "", [item.elements.eventType?.value]);

  useEffect(() => {
    const getEvents = async () => {
      const newData = await fetchEvents(isPreview, categories, locale);
      setData({ events: newData.events, totalCount: newData.totalCount });
    };
    getEvents();
  }, [isPreview, locale, categories]);

  const smartLinkAttributes = useMemo(() => createItemSmartLink(
    item.system.id,
    item.system.name,
    true
  ), [item.system.id, item.system.name]);

  return (
    <div
      className='prose w-full max-w-full py-4 mx-auto pb-24'
      {...smartLinkAttributes}
    >
      {item.elements.title?.value && (
        <h3 className='heading'>{item.elements.title.value}</h3>
      )}
      <div className='flex lg:flex-row flex-col gap-6'>
        {data.events?.map((event) => (
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
  );  
};