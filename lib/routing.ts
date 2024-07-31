import { contentTypes } from "../models";

const getExternalUrlsMapping = () => Object.fromEntries(
  process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS?.split(",")
    .map(collectionPair => collectionPair.split(":"))
    .map(([collectionCodename, domain]) => [collectionCodename, "https://" + domain]) ?? []
);

// union type of all nested terms codenames
type RecursiveTaxonomyCodenames<T extends { readonly terms: unknown }> = keyof T["terms"] extends infer TermCodenames
  ? TermCodenames extends keyof T["terms"]
  ? T["terms"][TermCodenames] extends infer ChildTerm extends { readonly terms: unknown }
  ? RecursiveTaxonomyCodenames<ChildTerm> | TermCodenames
  : never
  : never
  : never;

type GenericContentTypeOptions = Readonly<{
  type: typeof contentTypes.page.codename
  slug: string
}>;
type WebSpotlightRootOptions = Readonly<{
  type: typeof contentTypes.web_spotlight_root.codename
}>;

export type ResolutionContext = GenericContentTypeOptions
  | GenericContentTypeOptions
  | WebSpotlightRootOptions;


export const resolveUrlPath = (context: ResolutionContext) => {

  switch (context.type) {
    case contentTypes.web_spotlight_root.codename: {
      return `/`;
    }
    case contentTypes.page.codename: {
      // Possible to extend Page content type by i.e taxonomy to define more complex routing.
      return `/${context.slug}`;
    }
    default:
      return `/`;
  }
}

export const createQueryString = (params: Record<string, string | string[] | undefined>) => {

  const queryString = Object.entries(params).map(
    ([paramKey, paramValue]) => {
      if (!paramValue) {
        return undefined;
      }

      return typeof paramValue === 'string'
        ? `${paramKey}=${paramValue}`
        : paramValue.map(v => `${paramKey}=${v}`).join('&');
    },)
    .filter(p => p !== undefined)
    .join('&');

  return queryString;
}