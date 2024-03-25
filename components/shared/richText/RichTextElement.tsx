import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { Elements } from '@kontent-ai/delivery-sdk';
import {
  IPortableTextComponent,
  IPortableTextImage,
  IPortableTextInternalLink,
  IPortableTextItem,
  IPortableTextTable,
} from '@kontent-ai/rich-text-resolver';
import { nodeParse } from '@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node';
import { transformToPortableText } from '@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer';
import {
  PortableText,
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
  PortableTextTypeComponentProps,
} from '@portabletext/react';
import Image from 'next/image';
import { FC } from 'react';
import {
  ContentChunk,
  contentTypes,
  Testimonial,
  Carousel,
  FormHubspotIntegration,
  HeroUnit,
  ArticleListing,
  EventListing,
  YouTubeEmbed,
  FAQ,
  CallToAction,
  ProductListing,
  PanelListing,
  MilestoneListing,
} from '../../../models';
import { InternalLink } from '../internalLinks/InternalLink';
import { TestimonialComponent } from '../Testimonial';
import { CarouselComponent } from '../Carousel';
import { HubSpotFormComponent } from '../HubSpotForm';
import { HeroUnitComponent } from '../HeroUnit';
import { ArticleListingComponent } from '../ArticleListing';
import { EventListingComponent } from '../EventListing';
import { MilestoneListingComponent } from '../MilestoneListing';
import { YouTubeMovieComponent } from '../YouTubeMovie';
import { FaqAccordionComponent } from '../FaqAccordion';
import { ImageContainer } from '../../../models';
import { ImageContainerComponent } from '../ImageContainer';
import { CallToActionComponent } from '../CallToAction';
import { ProductListingComponent } from '../ProductListing';
import { PanelListingComponent } from '../PanelListing';
import { BuildError } from '../ui/BuildError';
import { sanitizeFirstChildText } from '../../../lib/anchors';
import { siteCodename } from '../../../lib/utils/env';
import { ContentChunkComponent } from '../ContentChunk';

type ElementProps = Readonly<{
  element: Elements.RichTextElement;
  isInsideTable: boolean;
  language: string;
}>;

export const createDefaultResolvers = (
  element: Elements.RichTextElement,
  isElementInsideTable: boolean = false,
  language = 'en-gb'
): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find((i) => i.imageId === value.asset._ref);
      if (!asset) {
        return null;
      }

      if (isElementInsideTable) {
        return (
          <div className='w-28 h-14 relative not-prose'>
            <Image
              src={value.asset.url}
              alt={asset.description ?? ''}
              fill
              className='object-contain'
            />
          </div>
        );
      }

      return (
        <span className='flex justify-center'>
          <Image
            src={value.asset.url}
            alt={asset.description ?? ''}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
          />
        </span>
      );
    },
    table: ({ value }: PortableTextTypeComponentProps<IPortableTextTable>) => {
      return (
        <table className='table-auto'>
          <tbody>
            {value.rows.map((r) => (
              <tr key={r._key}>
                {r.cells.map((c) => (
                  <td key={c._key}>
                    <RichTextValue
                      isInsideTable
                      language={language}
                      value={c.content}
                      element={element}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
    component: ({
      value,
    }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(
        (i) => i.system.codename === value.component._ref
      );

      if (!componentItem) {
        return null;
      }

      switch (componentItem.system.type) {
        case contentTypes.milestone_listing.codename:
          return (
            <MilestoneListingComponent
              item={componentItem as MilestoneListing}
            />
          );
        case contentTypes.hero_unit.codename:
          return (
            <HeroUnitComponent 
              item={componentItem as HeroUnit} 
              />
          );
        case contentTypes.article_listing.codename:
          return (
            <ArticleListingComponent
              item={componentItem as ArticleListing}
            />
          );
        case contentTypes.event_listing.codename:
          return (
            <EventListingComponent item={componentItem as EventListing} />
          );
        case contentTypes.product_listing.codename:
          return (
            <ProductListingComponent
              item={componentItem as ProductListing}
            />
          );
        case contentTypes.content_chunk.codename:
          return <ContentChunkComponent item={componentItem as ContentChunk} />;
        case contentTypes.testimonial.codename:
          return (
            <TestimonialComponent item={componentItem as Testimonial} />
          );
        case contentTypes.form.codename:
          return (
            <HubSpotFormComponent item={componentItem as FormHubspotIntegration} />
          );
        case contentTypes.carousel.codename:
          return <CarouselComponent item={componentItem as Carousel} />;
        case contentTypes.youtube_embed.codename:
          return (
            <YouTubeMovieComponent item={componentItem as YouTubeEmbed} />
          );
        case contentTypes.faq.codename:
          return <FaqAccordionComponent item={componentItem as FAQ} />;
        case contentTypes.image_container.codename:
          return (
            <ImageContainerComponent
              item={componentItem as ImageContainer} personalized={true}
            />
          );
        case contentTypes.call_to_action.codename:
          return (
            <CallToActionComponent item={componentItem as CallToAction} />
          );
        case contentTypes.panel_listing.codename:
          return (
            <PanelListingComponent item={componentItem as PanelListing} />
          );
        default:
          return (
            <BuildError>
              Unsupported content type &quot;{componentItem.system.type}&quot;
            </BuildError>
          );
      }
    },
  },
  marks: {
    sub: (props) => <sub>{props.children}</sub>,
    sup: (props) => <sup>{props.children}</sup>,
    internalLink: ({
      value,
      children,
    }: PortableTextMarkComponentProps<IPortableTextInternalLink>) => {
      const link = element.links.find(
        (l) => l.linkId === value?.reference._ref
      );
      if (!link) {
        return <>{children}</>;
      }

      return (
        <InternalLink link={link} language={language}>
          {children}
        </InternalLink>
      );
    },
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={value?.rel}
          title={value?.title}
        >
          {children}
          {!!value['data-new-window'] && (
            <ArrowTopRightOnSquareIcon className='w-5 inline-block ml-1' />
          )}
        </a>
      );
    },
  },
  block: {
    // TODO don't resolve when block contains link type markdef
    h1: ({ value, children }) => (
      <h1 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h1>
    ),
    h2: ({ value, children }) => (
      <h2 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h3>
    ),
    h4: ({ value, children }) => (
      <h4 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h4>
    ),
    h5: ({ value, children }) => (
      <h5 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h5>
    ),
    h6: ({ value, children }) => (
      <h6 className='scroll-mt-20 heading' id={sanitizeFirstChildText(value)}>
        <a href={`#${sanitizeFirstChildText(value)}`}>{children}</a>
      </h6>
    ),
  },
});

export const RichTextElement: FC<ElementProps> = (props) => {
  const portableText = transformToPortableText(nodeParse(props.element.value));

  return (
    <PortableText
      value={portableText}
      components={createDefaultResolvers(props.element, false, siteCodename)}
    />
  );
};

type RichTextValueProps = Readonly<{
  element: Elements.RichTextElement;
  language: string;
  value: IPortableTextItem[];
  isInsideTable: boolean;
}>;

const RichTextValue: FC<RichTextValueProps> = (props) => (
  <PortableText
    value={props.value}
    components={createDefaultResolvers(
      props.element,
      props.isInsideTable,
      props.language
    )}
  />
);
