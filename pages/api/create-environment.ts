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
    const isValidRequest = request && request.environment_name && request.user_email

    if (!isValidRequest) {
      console.log("Has invalid request body")
      res.status(400).end()
      return
    }
    const kms = new KontentManagementService()
    const vercel = new VercelService()

    console.log("Get Role ID for inviting a user to the new environment with the environment role")
    const roleId = process.env.KONTENT_ENVIRONMENTROLE_ID

    console.log("Clone new enviroment")
    console.log(`Environment name: ${request.environment_name}`)
    console.log(`RoleID: ${roleId}`)
    const newEnvironment = (await kms.cloneEnvironment(request.environment_name, [roleId]))

    if (!newEnvironment) {
      console.log("Error during cloning environment ")
      res.status(400).end()
      return
    }

    (async function fetchCloneSuccess() {
      let response = await kms.getEnvironmentCloningState(newEnvironment.id);
      let iterations = 0
      while (response.cloningInfo.cloningState != "done") {
        iterations++
        console.log(iterations)
        setTimeout(async () => {
          response = await kms.getEnvironmentCloningState(newEnvironment.id);  
        }, 5000);
      }
    })();
    console.log(newEnvironment)

    console.log("Create new hosting")
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const domainUrl = request.environment_name.toLowerCase().replace(" ", "-") + domain

    const result = (await vercel.addDomain(vercelProjectId, domainUrl))


    if (!result) {
      console.log("Error adding domain Vercel ")
      res.status(400).end()
      return
    }

    console.log("Create preview urls based on new hosting")
    const spaceCodeName = process.env.KONTENT_SPACE_CODENAME
    console.log(spaceCodeName)
    const space = (await kms.getSpace(newEnvironment.id, spaceCodeName))
    console.log("space")
    console.log(space)
    const contentTypeWSL = (await kms.getContentTypeByName("web_spotlight_root"))
    console.log("contentTypeWSL")
    console.log(contentTypeWSL)
    const updatePreview = (await kms.updatePreviewUrls(newEnvironment.id, space.id, domainUrl, contentTypeWSL.id))

    console.log("Invite user to new enviroment")
    const newUser = (await kms.inviteUser(newEnvironment.id, request.user_email, roleId))

    res.status(200).end()
    return
  }

  console.log("Missing request and body")
  res.status(400).end()
}

export interface CreateEnvironmentRequest {
  environment_name: string;
  user_email: string;
}