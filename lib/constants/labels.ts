import { PerCollection } from "../types/perCollection";

export const perCollectionSEOTitle = {
  corporate_site: "AQA",
  elitebuild: "EliteBuild",
  support: "Knowledgebase",
  pdf: "PDF print",  
  default: "default"
  } as const satisfies PerCollection<string>;