import { NextApiHandler } from "next";
import { getArticleTaxonomy } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
    const usePreview = parseBoolean(req.query.preview);
    if (usePreview === null) {
      return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
    }
    
    const currentEnvId = defaultEnvId;
    const currentPreviewApiKey = defaultPreviewKey;
    if (!currentEnvId) {
      return res.status(400).json({ error: "Missing envId cookie" });
    }
  
    if (usePreview && !currentPreviewApiKey) {
      return res.status(400).json({ error: "Missing previewApiKey cookie" });
    }
  
    const articleCategories = await getArticleTaxonomy({ envId: currentEnvId, previewApiKey: currentPreviewApiKey });
  
    return res.status(200).json(articleCategories);
  };
  
  export default handler;