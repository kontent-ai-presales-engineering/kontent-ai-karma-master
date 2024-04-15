import { NextApiHandler, NextApiResponse } from "next";
import { ResolutionContext, resolveUrlPath } from "../../lib/routing";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
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
    } as ResolutionContext);
  }
  if (req.query.lang) {
    path = `/${req.query.lang?.toString()}${path}`;
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
