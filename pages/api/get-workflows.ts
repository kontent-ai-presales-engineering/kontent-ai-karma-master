import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const kms = new KontentManagementService()
  const workflowSteps = (await kms.getDefaultWorkflow())?.steps

  res.json(workflowSteps)
}
