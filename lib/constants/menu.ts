import { PerCollection, ValidCollectionCodename } from "../types/perCollection";

export const perCollectionRootItems = {
  sandbox: "sandbox",
  elitebuild: "elitebuild",
  support: "support",
  pdf: "pdf",
  default: "default"
} as const satisfies PerCollection<string>;

export const externalUrlsMapping = Object.fromEntries(
  process.env.NEXT_PUBLIC_OTHER_COLLECTIONS_DOMAINS?.split(",")
    .map(collectionPair => collectionPair.split(":"))
    .map(([collectionCodename, domain]) => [collectionCodename, "https://" + domain]) ?? []
);

export const getRootCodename = (siteCodename: ValidCollectionCodename) => perCollectionRootItems[siteCodename];

