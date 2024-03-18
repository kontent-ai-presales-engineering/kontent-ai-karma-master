import { NextApiHandler } from "next";
import { getItemByCodename } from "../../lib/services/kontentClient";
import { envIdCookieName } from "../../lib/constants/cookies";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  const lang = req.query.language?.slice(-2).toString().toUpperCase()
  const language = req.query.language?.slice(0, 3).toString() + lang;
  if (!language) {
    res.status(405).end()
    return
  }
  
  const codename = req.query.codename;
  if (codename === null) {
    return res.status(400).json({ error: "Please provide 'codename' query parameter." });
  }
  
  const imagefield = req.query.codename;
  if (imagefield === null) {
    return res.status(400).json({ error: "Please provide 'imagefield' query parameter." });
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = defaultPreviewKey;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (!currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const data = await getItemByCodename(
    { envId: currentEnvId, previewApiKey: currentPreviewApiKey },
    codename as string,
    true,
    language
  );

  return data.elements[imagefield as string].value[0].url

  res.status(200).json(data);
}

export default handler;