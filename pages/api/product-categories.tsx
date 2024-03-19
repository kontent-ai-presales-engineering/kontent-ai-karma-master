import { NextApiHandler } from "next";
import { getProductTaxonomy } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName } from "../../lib/constants/cookies";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
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
  
    const productCategories = await getProductTaxonomy({ envId: currentEnvId, previewApiKey: currentPreviewApiKey });
  
    return res.status(200).json(productCategories);
  };
  
  export default handler;