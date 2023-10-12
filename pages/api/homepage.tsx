import { NextApiHandler } from "next";
import { getHomepage } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";

const handler: NextApiHandler = async (req, res) => {
  const lang = req.query.language?.slice(-2).toString().toUpperCase()
  const language = req.query.language?.slice(0, 3).toString() + lang;
  if (!language) {
    res.status(405).end()
    return
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = req.cookies[previewApiKeyCookieName];
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const data = await getHomepage({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview, language as string);

  res.status(200).json(data);
}

export default handler;