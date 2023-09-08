import { PerCollection } from "./types/perCollection";

export type PerCollectionCodenames = PerCollection<string | null>;

export const pageCodenames = {
  "about-us": {
    sandbox: "about_us_f9c172b",
    elitebuild: "about_us_f9c172b",
    support: "about_us_f9c172b",
    pdf: "about_us_f9c172b",
    default: "about_us_f9c172b",
  },
  "terms": {
    sandbox: "terms_and_conditions",
    elitebuild: "terms_and_conditions",
    support: null,
    pdf: null,
    default: null,
  },
  "products": {
    sandbox: "products",
    elitebuild: "products",
    support: null,
    pdf: null,
    default: null,
  },
  "articles": {
    sandbox: "articles",
    elitebuild: "articles",
    support: null,
    pdf: null,
    default: null,
  }
} as const satisfies Record<string, PerCollectionCodenames>;

