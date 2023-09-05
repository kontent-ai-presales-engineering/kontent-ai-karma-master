import { contentTypes } from "../../models";

interface linkType {
    linkId?: string;
    type: string;
    urlSlug: string;
}

export function resolveLink(
    link: linkType,
    language = "en"
): string {
    let resultLink;
    switch (link.type) {
        case contentTypes.page.codename:
            resultLink = `${link.urlSlug}`;
            break;

        case contentTypes.article.codename:
            resultLink = `/articles/${link.urlSlug}`;
            break;

        case contentTypes.product.codename:
            resultLink = `/products/${link.urlSlug}`;
            break;

        case contentTypes.event.codename:
            resultLink = `/events/${link.urlSlug}`;
            break;

        default:
            resultLink = '';
            break;
    }

    return `/${language}/${resultLink}`.toLowerCase();
}