import { PerCollection } from "../types/perCollection";

export const perCollectionSEOTitle = {
  sandbox: "Sandbox",
  elitebuild: "EliteBuild",
  support: "Knowledgebase",
  pdf: "PDF print",  
  default: "default"
  } as const satisfies PerCollection<string>;