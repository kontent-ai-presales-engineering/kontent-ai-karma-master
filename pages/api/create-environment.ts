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

    console.log("Get Role ID to  be activated in new environment")    
    const roleId = (await kms.getRoleIdByName(process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID, process.env.KONTENT_ENVIRONMENTROLE_NAME))

    console.log("Clone new enviroment")
    const newEnvironment = (await kms.cloneEnvironment(`${request.environment_name} - ${Date.now()}`, [roleId]))

    if (!newEnvironment) {
      console.log("Error during cloning environment ")
      res.status(400).end()
      return
    }

    console.log("Create new hosting")
    const domain = process.env.VERCEL_DOMAIN_NAME
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    const domainUrl = request.environment_name.toLowerCase().replace(" ", "-") + domain

    //Check if domain is already added
    console.log("Check if domain is already added")
    const domainExist = await vercel.checkDomainExists(vercelProjectId, domainUrl)
    console.log(domainExist)
    if (!domainExist) {      
      const result = (await vercel.addDomain(vercelProjectId, domainUrl))

      if (!result) {
        console.log("Error adding domain Vercel ")
        res.status(400).end()
        return
      }
    }

    (async function fetchCloneSuccess() {
      console.log("Check status cloning each 10 seconds")
      let response = await kms.getEnvironmentCloningState(newEnvironment.id);
      if (response.cloningInfo.cloningState != "done") {
        console.log("Cloning status is done")
        setTimeout(async () => {
          fetchCloneSuccess()
        }, 10000);
      }
      else  {
        console.log("Create preview urls based on new hosting")
        const spaceCodeName = process.env.KONTENT_SPACE_CODENAME;
        const space = (await kms.getSpace(newEnvironment.id, spaceCodeName))
        const contentTypeWSL = (await kms.getContentTypeByName("web_spotlight_root"))
        const updatePreview = (await kms.updatePreviewUrls(newEnvironment.id, space.id, domainUrl, contentTypeWSL.id))
        
        console.log("Get Role ID for inviting a user to the new environment with the environment role")  
        const newRoleId = (await kms.getRoleIdByName(newEnvironment.id, "Environment Manager"))
        if (!newRoleId) {
          console.log("Error role with name Environment Manager not found")
          res.status(400).end()
          return
        }
        console.log("Invite user to new enviroment")
        const newUser = (await kms.inviteUser(newEnvironment.id, request.user_email, newRoleId))
        res.status(200).end()
        return
      }
    })();
  }
  console.log("Missing request and body")
  res.status(400).end()
}

export interface CreateEnvironmentRequest {
  environment_name: string;
  user_email: string;
}