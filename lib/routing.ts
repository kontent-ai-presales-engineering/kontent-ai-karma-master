import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    corporate_site: "about_us_f9c172b",
    support: "about_us_f9c172b",
    pdf: "about_us_f9c172b",
    default: "about_us_f9c172b",
  },
  "terms": {
    corporate_site: "terms_and_conditions",
    support: null,
    pdf: null,
    default: null,
  },
  "products": {
    corporate_site: "products",
    support: null,
    pdf: null,
    default: null,
  },
  "articles": {
    corporate_site: "articles",
    support: null,
    pdf: null,
    default: null,
  }
} as const satisfies Record<string, PerCollectionCodenames>;

