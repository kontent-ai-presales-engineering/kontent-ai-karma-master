import { NextApiHandler } from "next";
import { getArticleTaxonomy } from "../../lib/services/kontent-service";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
    const usePreview = parseBoolean(req.query.preview);
    if (usePreview === null) {
      return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
    }
  
    const articleCategories = await getArticleTaxonomy(usePreview);
  
    return res.status(200).json(articleCategories);
  };
  
  export default handler;