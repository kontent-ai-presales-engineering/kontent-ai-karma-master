import { NextApiHandler } from "next";

import { getProductsForListing } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";

const handler: NextApiHandler = async (req, res) => {
  const page = req.query.page;
  const category = typeof req.query.category === "string" ? [req.query.category] : req.query.category;

  const pageNumber = parseInt(page as string)

  const lang = req.query.language?.slice(-2).toString().toUpperCase()
  const language = req.query.language?.slice(0, 3).toString() + lang;
  if (typeof language !== "string") {
    return res.status(400).json({ error: "You have to provide 'language' query parameter" });
  }

  if (page && isNaN(pageNumber)) {
    return res.status(400).json({ error: "The value you provided for page is not a number" });
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

  const products = await getProductsForListing({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview, language as string, isNaN(pageNumber) ? undefined : pageNumber, category);

  return res.status(200).json({ products: products.items, totalCount: products.pagination.totalCount });
};

export default handler;