import { NextApiHandler, NextApiResponse } from "next";
import { envIdCookieName } from "../../lib/constants/cookies";
import { ResolutionContext, resolveUrlPath } from "../../lib/routing";
import { NextResponse } from "next/server";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";
const cookieOptions = { path: '/', sameSite: 'none', secure: true } as const;

const handler: NextApiHandler = async (req, res) => {
  // TODO move secret to env variables
  if (req.query.secret !== 'mySuperSecret' || !req.query.slug) {
    res.status(401).json({ message: 'Invalid preview token, or no slug and type provided.' });
    return;
  }

  const response = NextResponse.next()
  if (!req.cookies[envIdCookieName]) {
    response.cookies.set(envIdCookieName, defaultEnvId, cookieOptions);
  }

  const currentPreviewApiKey = defaultPreviewKey;

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(currentPreviewApiKey);
  const newCookieHeader = makeCookiesCrossOrigin(res);
  if (newCookieHeader) {
    res.setHeader("Set-Cookie", newCookieHeader);
  }

  let path = req.query.slug.toString()

  if (req.query.type) {
    path = resolveUrlPath({
      type: req.query.type.toString(),
      slug: req.query.slug.toString()
    } as ResolutionContext, req.query.lang?.toString());
  }

  // Redirect to the path from the fetched post
  res.redirect(path);
}

export default handler;

const makeCookieCrossOrigin = (header: string) => {
  const cookie = header.split(";")[0];

  return cookie
    ? `${cookie}; Path=/; SameSite=None; Secure`
    : "";
};

const makeCookiesCrossOrigin = (response: NextApiResponse) => {
  const header = response.getHeader("Set-Cookie");

  if (typeof header === "string") {
    return makeCookieCrossOrigin(header);
  }
  if (Array.isArray(header)) {
    return header.map(makeCookieCrossOrigin);
  }

  return header;
}
