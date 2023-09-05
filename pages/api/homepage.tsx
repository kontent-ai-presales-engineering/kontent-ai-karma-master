import { NextApiHandler } from "next";

import { getHomepage } from "../../lib/services/kontent-service";
import { parseBoolean } from "../../lib/utils/parseBoolean";

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

  const data = await getHomepage(usePreview, language as string);

  res.status(200).json(data);
}

export default handler;