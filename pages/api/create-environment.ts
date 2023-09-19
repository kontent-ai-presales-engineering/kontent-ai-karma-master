import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"
import VercelService from "../../lib/services/vercel-service"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    console.log("Not a post request")
    res.status(405).end()
    return
  }

  if (req && req.body) {
    console.log("Has request and body")
    const request = req.body as CreateEnvironmentRequest
    console.log(request)
    const isValidRequest = request && request.environmentName && request.userEmail

    if (!isValidRequest) {
      console.log("Has invalid request body")
      res.status(400).end()
      return
    }

    const kms = new KontentManagementService()
    const vercel = new VercelService()

    console.log("Get Role ID for inviting a user to the new environment with the environment role")
    const roleName = process.env.KONTENT_ENVIRONMENTROLE_CODENAME
    const roleId = (await kms.getRole(roleName))?.id

    console.log("Clone new enviroment")
    const newEnvironment = (await kms.cloneEnvironment(request.environmentName, [roleId]))

    console.log("Create new hosting")
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const domainUrl = request.environmentName + domain
    const result = vercel.addDomain(vercelProjectId, domainUrl)

    console.log("Create preview urls based on new hosting")
    const spaceCodeName = process.env.KONTENT_SPACE_CODENAME
    const space = (await kms.getSpace(newEnvironment.id, spaceCodeName))
    const contentTypeWSL = (await kms.getContentTypeByName("web_spotlight_root"))
    const updatePreview = (await kms.updatePreviewUrls(newEnvironment.id, space.id, domainUrl, contentTypeWSL.id))

    console.log("Invite user to new enviroment")
    const newUser = (await kms.inviteUser(newEnvironment.id, request.userEmail, roleId))

    res.status(200).end()
    return
  }

  console.log("Missing request and body")
  res.status(400).end()
}

export interface CreateEnvironmentRequest {
  environmentName: string
  userEmail: string
}