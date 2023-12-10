import { PerCollection } from "../types/perCollection";

export const perCollectionSEOTitle = {
  sandbox: "Karma Manufacturing",
  elitebuild: "EliteBuild",
  support: "Knowledgebase",
  pdf: "PDF print",  
  default: "default"
  } as const satisfies PerCollection<string>;