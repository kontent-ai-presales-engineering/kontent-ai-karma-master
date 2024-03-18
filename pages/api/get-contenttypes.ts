import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const kms = new KontentManagementService()
  const contentTypes = (await kms.getContentTypes())

  res.json(contentTypes)
}