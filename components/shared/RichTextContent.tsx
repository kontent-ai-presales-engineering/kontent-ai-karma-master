import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Elements } from "@kontent-ai/delivery-sdk";
import { IPortableTextComponent, IPortableTextImage, IPortableTextInternalLink, IPortableTextItem, IPortableTextTable } from "@kontent-ai/rich-text-resolver";
import { nodeParse } from "@kontent-ai/rich-text-resolver/dist/cjs/src/parser/node";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver/dist/cjs/src/transformers/portable-text-transformer";
import { PortableText, PortableTextMarkComponentProps, PortableTextReactComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import Image from "next/image";
import { FC } from "react";
import { createElementSmartLink, createFixedAddSmartLink, createItemSmartLink, createRelativeAddSmartLinkWithComponentId } from "../../lib/utils/smartLinkUtils";
import { Block_ContentChunk, Component_Callout, contentTypes, Block_Testimonial, Block_Carousel, Block_HubspotForm, Block_HeroUnit, Block_ArticleListing, Block_EventListing, Block_Grid, Block_Stack, Block_YouTubeEmbed, FAQ, Block_CallToAction, Block_TweetEmbed, Block_Image, Block_ProductListing } from "../../models";
import { InternalLink } from "./internalLinks/InternalLink";
import { CalloutComponent } from "./richText/Callout";
import { TestimonialComponent } from "./Testimonial";
import { CarouselComponent } from "./Carousel";
import { HubSpotFormComponent } from "./HubSpotForm";
import { HeroUnitComponent } from "./HeroUnit";
import { ArticleListingComponent } from "./ArticleListing";
import { EventListingComponent } from "./EventListing";
import { GridComponent } from "./Grid";
import { StackComponent } from "./Stack";
import { YouTubeMovieComponent } from "./YouTubeMovie";
import { FaqAccordionComponent } from "./FaqAccordion";
import { Block_ImageContainer } from "../../models";
import { ImageContainerComponent } from "./ImageContainer";
import { CallToActionComponent } from "./CallToAction";
import { TweetComponent } from "./Tweet";
import { ImageComponent } from "./Image";
import { ProductListingComponent } from "./ProductListing";

type Props = Readonly<{
  item: Block_ContentChunk;
}>;

export const RichTextContentComponent: FC<Props> = props => (
  <div
    className="px-3 md:px-0"
    {...createItemSmartLink(props.item.system.id, props.item.system.name)}
    {...createElementSmartLink(contentTypes.content_chunk.elements.content.codename)}
    {...createFixedAddSmartLink("end")}
  >
    <RichTextElement
      element={props.item.elements.content}
      language={props.item.system.language}
      isInsideTable={false}
    />
  </div>
);

type ElementProps = Readonly<{
  element: Elements.RichTextElement;
  language: string;
  isInsideTable: boolean;
}>;

export const RichTextElement: FC<ElementProps> = props => {
  const portableText = transformToPortableText(nodeParse(props.element.value));

  return (
    <PortableText
      value={portableText}
      components={createDefaultResolvers(props.element, false, props.language)}
    />
  );
};

type RichTextValueProps = Readonly<{
  element: Elements.RichTextElement;
  language: string;
  value: IPortableTextItem[];
  isInsideTable: boolean;
}>;

const RichTextValue: FC<RichTextValueProps> = props => (
  <PortableText
    value={props.value}
    components={createDefaultResolvers(props.element, props.isInsideTable, props.language)}
  />
);

const createDefaultResolvers = (element: Elements.RichTextElement, isElementInsideTable: boolean = false, language = "en"): Partial<PortableTextReactComponents> => ({
  types: {
    image: ({ value }: PortableTextTypeComponentProps<IPortableTextImage>) => {
      const asset = element.images.find(i => i.imageId === value.asset._ref);
      if (!asset) {
        throw new Error(`Asset ${value.asset._ref} not found.`);
      }

      if (isElementInsideTable) {
        return (
          <div className="w-28 h-14 relative not-prose">
            <Image
              src={value.asset.url}
              alt={asset.description ?? ""}
              fill
              className="object-contain"
            />
          </div>
        )
      }

      return (
        <span className="flex justify-center">
          <Image
            src={value.asset.url}
            alt={asset.description ?? ""}
            width={asset.width ?? undefined}
            height={asset.height ?? undefined}
          />
        </span>
      );
    },
    table: ({ value }: PortableTextTypeComponentProps<IPortableTextTable>) => {
      return (
        <table className="table-auto">
          <tbody>
            {value.rows.map(r => (
              <tr key={r._key}>
                {r.cells.map(c => (
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
      )
    },
    component: ({ value }: PortableTextTypeComponentProps<IPortableTextComponent>) => {
      const componentItem = element.linkedItems.find(i => i.system.codename === value.component._ref);
      if (!componentItem) {
        throw new Error("Component item not found, probably not enought depth requested.");
      }

      let component = <div>Unsupported content type &quot;{componentItem.system.type}&quot;</div>
      switch (componentItem.system.type) {
        case contentTypes.grid.codename:
          component = <GridComponent item={componentItem as Block_Grid} />
          break;
        case contentTypes.stack.codename:
          component = <StackComponent item={componentItem as Block_Stack} />
          break;
        case contentTypes.hero_unit.codename:
          component = <HeroUnitComponent item={componentItem as Block_HeroUnit} />
          break;
        case contentTypes.article_listing.codename:
          component = <ArticleListingComponent item={componentItem as Block_ArticleListing} />
          break;
        case contentTypes.event_listing.codename:
          component = <EventListingComponent item={componentItem as Block_EventListing} />
          break;
        case contentTypes.product_listing.codename:
          component = <ProductListingComponent item={componentItem as Block_ProductListing} />
          break;
        case contentTypes.callout.codename:
          component = <CalloutComponent item={componentItem as Component_Callout} />
          break;
        case contentTypes.content_chunk.codename:
          component = <RichTextContentComponent item={componentItem as Block_ContentChunk} />
          break;
        case contentTypes.testimonial.codename:
          component = <TestimonialComponent item={componentItem as Block_Testimonial} />
          break;
        case contentTypes.hubspot_form.codename:
          component = <HubSpotFormComponent item={componentItem as Block_HubspotForm} />
          break;
        case contentTypes.carousel.codename:
          component = <CarouselComponent item={componentItem as Block_Carousel} />
          break;
        case contentTypes.youtube_embed.codename:
          component = <YouTubeMovieComponent item={componentItem as Block_YouTubeEmbed} />;
          break;
        case contentTypes.faq.codename:
          component = <FaqAccordionComponent item={componentItem as FAQ} />;
          break;
        case contentTypes.image_container.codename:
          component = <ImageContainerComponent item={componentItem as Block_ImageContainer} />;
          break;
        case contentTypes.call_to_action.codename:
          component = <CallToActionComponent item={componentItem as Block_CallToAction} />;
          break;
        case contentTypes.tweet_embed.codename:
          component = <TweetComponent item={componentItem as Block_TweetEmbed} />;
          break;
        case contentTypes.image.codename:
          component = <ImageComponent item={componentItem as Block_Image} />;
          break;
        default:
          return component;
      }
      return <div
        {...createRelativeAddSmartLinkWithComponentId(componentItem.system.id, "after", "bottom")}>{component}</div>
    },
  },
  marks: {
    sub: props => (
      <sub>
        {props.children}
      </sub>
    ),
    sup: props => (
      <sup>
        {props.children}
      </sup>
    ),
    internalLink: ({ value, children }: PortableTextMarkComponentProps<IPortableTextInternalLink>) => {
      const link = element.links.find(l => l.linkId === value?.reference._ref);
      if (!link) {
        return (<>
          {children}
        </>)
      }

      return (
        <InternalLink link={link} language={language}>
          {children}
        </InternalLink>
      );
    },
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={value?.rel}
          title={value?.title}
        >
          {children}
          {!!value["data-new-window"] && <ArrowTopRightOnSquareIcon className="w-5 inline-block ml-1" />}
        </a>
      );
    },
  },
});

