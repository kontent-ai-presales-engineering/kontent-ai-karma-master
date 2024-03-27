import { Article, contentTypes, Product, taxonomies, WSL_Page, WSL_WebSpotlightRoot } from "../models";

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

type ArticleListingPathOptions = Readonly<{
  type: typeof contentTypes.article.codename;
  term: keyof typeof taxonomies.article_type.terms | "all",
  page?: number
}>;

type ProductListingPathOptions = Readonly<{
  type: typeof contentTypes.product.codename;
  terms: ReadonlyArray<RecursiveTaxonomyCodenames<typeof taxonomies.product_category>>
  page?: number
}>;

type CourseListingPathOptions = Readonly<{
  type: typeof contentTypes.course.codename;
  terms: ReadonlyArray<RecursiveTaxonomyCodenames<typeof taxonomies.product_category>>
  page?: number
}>;

type GenericContentTypeOptions = Readonly<{
  type: typeof contentTypes.page.codename
  | typeof contentTypes.article.codename
  | typeof contentTypes.image_container.codename
  | typeof contentTypes.product.codename
  | typeof contentTypes.course.codename,
  slug: string
}>;
type WebSpotlightRootOptions = Readonly<{
  type: typeof contentTypes.web_spotlight_root.codename
}>;

export type ResolutionContext = GenericContentTypeOptions
  | ArticleListingPathOptions
  | ProductListingPathOptions
  | CourseListingPathOptions
  | GenericContentTypeOptions
  | WebSpotlightRootOptions;

export const reservedListingSlugs = {
  articles: "articles",
  courses: "courses",  
  products: "products"
};

export const resolveUrlPath = (context: ResolutionContext, language = "en-gb") => {

  switch (context.type) {
    case contentTypes.web_spotlight_root.codename: {
      return `/${language}/`;
    }
    case contentTypes.page.codename: {
      // Possible to extend Page content type by i.e taxonomy to define more complex routing.
      return `/${language}/${context.slug}`;
    }
    case contentTypes.image_container.codename: {
      // Possible to extend Page content type by i.e taxonomy to define more complex routing.
      return `/${language}/banner/${context.slug}`;
    }
    case contentTypes.article.codename: {
      if ("term" in context) {
        if (context.term === "all" && !context.page) {
          return `/${language}/${reservedListingSlugs.articles}`
        }

        return `/${language}/${reservedListingSlugs.articles}/category/${context.term}${context.page ? `/page/${context.page}` : ""}`
      }

      return `/${language}/${reservedListingSlugs.articles}/${context.slug}`;

    }
    case contentTypes.product.codename: {
      if ("terms" in context) {
        const query = createQueryString({
          category: context.terms as string[],
          page: context.page?.toString() || undefined
        });
        return `/${language}/${reservedListingSlugs.products}${query && '?' + query}`
      }

      return `/${language}/${reservedListingSlugs.products}/${context.slug}`;
    }
    case contentTypes.course.codename: {
      if ("terms" in context) {
        const query = createQueryString({
          category: context.terms as string[],
          page: context.page?.toString() || undefined
        });
        return `/${language}/${reservedListingSlugs.courses}${query && '?' + query}`
      }

      return `/${language}/${reservedListingSlugs.courses}/${context.slug}`;
    }
    default:
      return `/${language}`;
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