
import { NextApiRequest, NextApiResponse } from "next"
import TranslationService from "../../lib/services/translation-service"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Manual triggered")
  if (req.method !== "POST") {
    console.log("Not a post request")
    res.status(405).end()
    return
  }

  console.log("Was a post request, trying to handle")

  if (req && req.body) {
    console.log("Has request and body")
    const request = req.body as ManualTranslateRequest

    const isValidRequest = request && request.itemId && request.language
    if (!isValidRequest) {
      console.log("Has invalid request body")
      res.status(400).end()
      return
    }

    console.log("Has valid request body")
    const translationService = new TranslationService()
    console.log("triggering translation")
    await translationService.handleTranslation({ ...request })
    console.log("translation done")

    res.status(200).end()
    return
  }

  res.status(200).end()
}

export interface ManualTranslateRequest {
  itemId: string
  language: string
}