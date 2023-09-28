import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"
import VercelService from "../../lib/services/vercel-service"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for POST method
  if (req.method !== "POST") {
    console.log("Not a POST request")
    return res.status(405).end()
  }

  // Check if request body exists and is valid
  const request = req.body as CreateEnvironmentRequest
  if (!request || !request.environment_name || !request.user_email) {
    console.log("Invalid request body")
    return res.status(400).end()
  }

  // Initialize services
  const kms = new KontentManagementService()
  const vercel = new VercelService()

  try {
    // Get Role ID to be activated in the new environment
    console.log("Get Role ID to be activated in the new environment")
    const roleId = await kms.getRoleIdByName(process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID, process.env.KONTENT_ENVIRONMENTROLE_NAME)

    // Clone new environment
    console.log("Clone new environment")
    const newEnvironment = await kms.cloneEnvironment(`${request.environment_name} - ${Date.now()}`, [roleId])

    if (!newEnvironment) {
      console.log("Error during cloning environment")
      return res.status(400).end()
    }

    // Create new hosting
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const domainUrl = request.environment_name.toLowerCase().replace(" ", "-") + domain

    // Check if domain is already added
    console.log("Check if domain is already added")
    const domainExists = await vercel.checkDomainExists(vercelProjectId, domainUrl)

    if (!domainExists) {
      // Add new domain to Vercel
      console.log("Add new domain to Vercel")
      const result = await vercel.addDomain(vercelProjectId, domainUrl)

      if (!result) {
        console.log("Error adding domain to Vercel")
        return res.status(400).end()
      }
    }

    // Fetch cloning success status
    console.log("Check cloning status (checking every 30 seconds)")
    let cloningStatus = 'in progress';
    while (cloningStatus !== 'done') {      
      console.log("Cloning still in progress")
      // Fetch the cloning status.
      const response = await kms.getEnvironmentCloningState(newEnvironment.id)
      cloningStatus = response.cloningInfo.cloningState;

      // Wait for 10 seconds before polling again.
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

    console.log("Clone ready; create preview URLs based on new hosting")
    const spaceCodeName = process.env.KONTENT_SPACE_CODENAME
    const space = await kms.getSpace(newEnvironment.id, spaceCodeName)
    const updatePreview = await kms.updatePreviewUrls(newEnvironment.id, space.id, domainUrl)

    // Get Role ID for inviting a user to the new environment with the environment role
    const newRoleId = await kms.getRoleIdByName(newEnvironment.id, process.env.KONTENT_ENVIRONMENTROLE_NAME)
    if (!newRoleId) {
      console.log("Error: Role with name Environment Manager not found")
      return res.status(400).end()
    }

    // Invite user to the new environment
    console.log("Invite user to the new environment")
    const newUser = await kms.inviteUser(newEnvironment.id, request.user_email, newRoleId)

    res.status(200).json({ cloningStatus });

  } catch (error) {
    console.error("An error occurred:", error)
    return res.status(500).end()
  }
}

export interface CreateEnvironmentRequest {
  environment_name: string;
  user_email: string;
}