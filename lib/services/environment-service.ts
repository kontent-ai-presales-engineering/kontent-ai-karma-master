
import { _Trial } from "../../models"
import { defaultEnvId, defaultPreviewKey } from "../utils/env";
import KontentManagementService from "./kontent-management-service";
import { getItemById } from "./kontentClient";
import VercelService from "./vercel-service";

export default class EnvironmentService {
  public kms = new KontentManagementService()
  public vercel = new VercelService()
  constructor() { }

  public async removeEnvironment(itemId: string): Promise<void> {
    let workflowID = "0";

    const contentItem = await getItemById<_Trial>({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, itemId, true, "en-GB");

    // Clone new environment
    console.log("Clone new environment")
    const removedEnvironment = await this.kms.removeEnvironment(contentItem.elements.environmentId.value)

    // Create new hosting
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID

    // Check if domain is already added
    console.log("Check if domain is already added")
    const domainExists = await this.vercel.checkDomainExists(vercelProjectId, contentItem.elements.domainUrl.value)

    if (domainExists) {
      // Add new domain to Vercel
      console.log("Add new domain to Vercel")
      const result = await this.vercel.removeDomain(vercelProjectId, contentItem.elements.domainUrl.value)
    }
  }
}