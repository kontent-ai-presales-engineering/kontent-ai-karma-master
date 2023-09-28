import { NextApiHandler } from "next";
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

const handler: NextApiHandler = (req, res) => {
  if (!req.query.envid || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid preview token' })
  }

  console.log("cookie create1")
  // To change a cookie, first create a response
  const response = NextResponse.next()

  console.log("cookie create2")
  response.cookies.delete('kontent-ai-hermes-envid')
  const envid = req.query.envid
  response.cookies.set('kontent-ai-hermes-envid', envid, { secure: true })
  console.log("cookie created")
  const envidCookie = response.cookies.get('kontent-ai-hermes-envid')
  console.log(envidCookie)

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(req.query.slug.toString());
}

export default handler;
