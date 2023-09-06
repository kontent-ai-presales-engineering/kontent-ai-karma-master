import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    corporate_site: "about_us_f9c172b",
    elitebuild: "about_us_f9c172b",
    support: "about_us_f9c172b",
    elysium: "about_us_f9c172b",
    default: "about_us_f9c172b",
  },
  "terms": {
    corporate_site: "terms_and_conditions",
    elitebuild: "terms_and_conditions",
    support: null,
    elysium: null,
    default: null,
  },
  "products": {
    corporate_site: "products",
    elitebuild: "products",
    support: null,
    elysium: null,
    default: null,
  },
  "articles": {
    corporate_site: "articles",
    elitebuild: "articles",
    support: null,
    elysium: null,
    default: null,
  }
} as const satisfies Record<string, PerCollectionCodenames>;

