import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"
import VercelService from "../../lib/services/vercel-service"
import { contentTypes } from "../../models"
export const maxDuration = 300; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for POST method
  if (req.method !== "POST") {
    console.log("Not a POST request")
    return res.status(405).end()
  }

  // Check if request body exists and is valid
  const request = req.body as CreateEnvironmentRequest
  let log = [`Create new trial - ${request.environment_name} - ${request.user_email}`]
  if (!request || !request.environment_name || !request.user_email) {
    console.log("Invalid request body")
    log.push("Invalid request body")
    return res.status(400).end()
  }

  // Initialize services
  const kms = new KontentManagementService()
  const vercel = new VercelService()

  // Get date  
  const date = new Date();

  // Create content item 
  console.log("Log inside a new content item")
  log.push("Log inside a new content item")
  console.log(date)
  const contentItem = await kms.createContentItem(`${request.environment_name} - ${date.toLocaleString()}`, contentTypes.trial.codename)

  try {
    //Domain variables
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const domainUrl = request.environment_name.toLowerCase().replace(" ", "-") + domain

    // Get Role ID to be activated in the new environment
    console.log("Get Role ID to be activated in the new environment")
    log.push("Get Role ID to be activated in the new environment")
    const roleId = await kms.getRoleIdByName(process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID, process.env.KONTENT_ENVIRONMENTROLE_NAME)

    // Clone new environment
    console.log("Clone new environment")
    log.push("Clone new environment")
    const newEnvironment = await kms.cloneEnvironment(`${request.environment_name} - ${Date.now()}`, [roleId])

    const elements = (builder) => {
      return {
        elements: [
          builder.textElement({
            element: {
              codename: contentTypes.trial.elements.company_name.codename
            },
            value: request.environment_name
          }),
          builder.textElement({
            element: {
              codename: contentTypes.trial.elements.domain_url.codename
            },
            value: domainUrl
          }),
          builder.textElement({
            element: {
              codename: contentTypes.trial.elements.email_address.codename
            },
            value: request.user_email
          }),
          builder.textElement({
            element: {
              codename: contentTypes.trial.elements.environment_id.codename
            },
            value: newEnvironment.id
          }),
          builder.textElement({
            element: {
              codename: contentTypes.trial.elements.log.codename
            },
            value: log.toString()
          }),
          builder.dateTimeElement({
            element: {
              codename: contentTypes.trial.elements.when_started.codename
            },
            value: date
          })
        ]
      }
    }
    const upsertResult = await kms.upsertLanguageContentVariant(contentItem.id, "", elements)

    if (!newEnvironment) {
      console.log("Error during cloning environment")
      log.push("Error during cloning environment")
      UpdateLog(log, contentItem.id, kms)
      return res.status(400).end()
    }

    // Check if domain is already added
    console.log("Check if domain is already added")
    log.push("Check if domain is already added")
    
    const domainExists = await vercel.checkDomainExists(vercelProjectId, domainUrl)

    if (!domainExists) {
      // Add new domain to Vercel
      console.log("Add new domain to Vercel")
      log.push("Add new domain to Vercel")
      const result = await vercel.addDomain(vercelProjectId, domainUrl)

      if (!result) {
        console.log("Error adding domain to Vercel")
        log.push("Error adding domain to Vercel")
        UpdateLog(log, contentItem.id, kms)
        return res.status(400).end()
      }
    }

    // Fetch cloning success status
    console.log("Check cloning status (checking every 60 seconds)")
    log.push("Check cloning status (checking every 60 seconds)")
    let cloningStatus = 'in progress';
    while (cloningStatus !== 'done') {
      console.log("Cloning still in progress")
      log.push("Cloning still in progress")
      // Fetch the cloning status.
      const response = await kms.getEnvironmentCloningState(newEnvironment.id)
      cloningStatus = response.cloningInfo.cloningState;

      // Wait for 10 seconds before polling again.
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    console.log("Clone ready; create preview URLs based on new hosting")
    log.push("Clone ready; create preview URLs based on new hosting")
    const spaceCodeName = process.env.KONTENT_SPACE_CODENAME
    const space = await kms.getSpace(newEnvironment.id, spaceCodeName)
    const updatePreview = await kms.updatePreviewUrls(newEnvironment.id, space.id, domainUrl)

    // Get Role ID for inviting a user to the new environment with the environment role
    const newRoleId = await kms.getRoleIdByName(newEnvironment.id, process.env.KONTENT_ENVIRONMENTROLE_NAME)
    if (!newRoleId) {
      console.log("Error: Role with name Environment Manager not found")
      log.push("Error: Role with name Environment Manager not found")
      UpdateLog(log, contentItem.id, kms)
      return res.status(400).end()
    }

    // Invite user to the new environment
    console.log("Invite user to the new environment")
    log.push("Invite user to the new environment")
    const newUser = await kms.inviteUser(newEnvironment.id, request.user_email, newRoleId)


    UpdateLog(log, contentItem.id, kms)

    res.status(200).json({ cloningStatus });

  } catch (error) {
    console.error("An error occurred:", error)
    log.push(`An error occurred\n`)
    UpdateLog(log, contentItem.id, kms)
    return res.status(500).end()
  }
}

export async function UpdateLog(log: string[], contentItemId: string, kms: any) {
  const elements = (builder) => {
    return {
      elements: [
        builder.textElement({
          element: {
            codename: contentTypes.trial.elements.log.codename
          },
          value: log.join("\n")
        })
      ]
    }
  }
  const upsertResult = await kms.upsertLanguageContentVariant(contentItemId, "", elements)
}

export interface CreateEnvironmentRequest {
  environment_name: string;
  user_email: string;
}