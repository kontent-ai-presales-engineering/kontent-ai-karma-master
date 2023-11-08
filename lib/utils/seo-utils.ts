import { transformImageUrl } from "@kontent-ai/delivery-sdk";
import { getFirstMultipleChoiceOptionCodename } from "./element-utils";
import { AspectRatio, getDimensionsForAspectRatio } from "./image-transformation-utils";
import { WSL_WebSpotlightRoot, WSL_Page, Article, Product, Event, Course } from "../../models";
import { perCollectionSEOTitle } from "../constants/labels";


interface ISeoAndSharingParams {
    page: WSL_WebSpotlightRoot | Article | Product | WSL_Page | Event | Course
    url: string,
    siteCodename: string,
    includeTitleSuffix?: boolean
    isPreview?: boolean
}

export function getSeoAndSharingDetails({ page, url, siteCodename, includeTitleSuffix = true, isPreview = false }: ISeoAndSharingParams) {
    const previewPrefix = isPreview ? "✏ " : ""
    const siteTitle = perCollectionSEOTitle[siteCodename];
    const pageTitle = page.elements.seoMetadataTitle?.value  != "" ? page.elements.seoMetadataTitle?.value : page.elements.title.value;
    const title = pageTitle !== siteTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    const description = page.elements.seoMetadataDescription?.value
    const nofollow = getFirstMultipleChoiceOptionCodename(page.elements.seoMetadataRobotsFollow?.value, 'follow') == "follow" ? false : true
    const noindex = getFirstMultipleChoiceOptionCodename(page.elements.seoMetadataRobotsIndex?.value, 'index') == "index" ? false : true

    const ogTitle = page.elements.seoMetadataTitle?.value ? page.elements.openGraphMetadataTitle?.value : title
    const ogDescription = page.elements.openGraphMetadataDescription.value ? page.elements.openGraphMetadataDescription.value : description

    const asset = page.elements.openGraphMetadataImage.value?.length > 0 ? page.elements.openGraphMetadataImage.value[0] : null
    let ogImage = asset ? asset.url : ""

    const canUrl = page.elements.seoMetadataCanonicalUrl?.value ? page.elements.seoMetadataCanonicalUrl.value : process.env.NEXT_PUBLIC_SITE_DOMAIN + "/" + url
    const canonicalUrl = noindex ? "" : canUrl

    if (asset) {
        const { width, height } = getDimensionsForAspectRatio(asset.width as number, AspectRatio.OpenGraph, 1200)
        ogImage = transformImageUrl(ogImage)
            .withFormat("jpg")
            .withHeight(height)
            .withWidth(width)
            .withFitMode("crop")
            .getUrl()
    }

    return {
        title: previewPrefix + title + (includeTitleSuffix ? " | EliteBuild" : ""),
        description,
        canonicalUrl,
        nofollow: nofollow,
        noindex: noindex,
        openGraph: {
            url,
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: ogImage
                }
            ],
            site_name: "EliteBuild",
            type: "website"
        }
    }
}