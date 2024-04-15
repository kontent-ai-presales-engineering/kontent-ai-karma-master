import { NextApiHandler } from "next";
import { getRobotsTxt } from "../../lib/services/kontentClient";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  const currentEnvId = defaultEnvId;
  const currentPreviewApiKey = defaultPreviewKey;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (!currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }
  
  const robots = await getRobotsTxt({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, false);
  let robotsTxt = ""
  if (robots) {
    robotsTxt = robots?.elements.content.value as string
  }

  res.send(robotsTxt);
}

export default handler;