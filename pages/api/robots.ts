import { NextApiHandler } from "next";
import { getRobotsTxt } from "../../lib/services/kontentClient";
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";

const handler: NextApiHandler = async (req, res) => {
  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = req.cookies[previewApiKeyCookieName];
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (!currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }
  const robots = await getRobotsTxt({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, false);
  let robotsTxt = "User-agent: */r Disallow: /"
  if (robots) {
    robotsTxt = robots?.elements.content.value as string
  }

  res.send(robotsTxt);
}

export default handler;