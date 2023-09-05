import { SignatureHelper } from '@kontent-ai/webhook-helper'
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  const getBody = new Promise<string>(resolve => {
    if (!req.body) {
      let buffer = ''
      req.on('data', (chunk => {
        buffer += chunk
      }))

      req.on('end', () => {
        const body = Buffer.from(buffer).toString()
        resolve(body)
      })
    }
  })

  getBody.then(body => {
    const signatureHelper = new SignatureHelper()
    if (signatureHelper.isValidSignatureFromString(body, "secret", req.headers['x-kc-signature'] as string)) {
      
      const bodyParsed = JSON.parse(body)

      res.json({ valid: true })
    }

    res.json({ valid: false })
  })
}