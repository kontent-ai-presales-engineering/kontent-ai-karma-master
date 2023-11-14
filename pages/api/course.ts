import { NextApiHandler } from "next";

import { getItemByCodename } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName } from "../../lib/constants/cookies";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  const courseCodename = req.query.codename;
  if (typeof courseCodename !== "string") {
    return res.status(400).json({ error: "You have to provide 'codename' query parameter with the course's codename." });
  }

  const lang = req.query.language?.slice(-2).toString().toUpperCase()
  const language = req.query.language?.slice(0, 3).toString() + lang;
  if (typeof language !== "string") {
    return res.status(400).json({ error: "You have to provide 'language' query parameter" });
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = defaultPreviewKey;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const course = await getItemByCodename({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, courseCodename, usePreview, language as string);

  return res.status(200).json({ course });
};

export default handler;