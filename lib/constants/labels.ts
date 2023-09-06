import { PerCollection } from "../types/perCollection";

export const perCollectionSEOTitle = {
  corporate_site: "Sandbox - Kontent.ai",
  elitebuild: "EliteBuild",
  support: "Knowledgebase",
  elysium: "Elysium",  
  default: "default"
  } as const satisfies PerCollection<string>;