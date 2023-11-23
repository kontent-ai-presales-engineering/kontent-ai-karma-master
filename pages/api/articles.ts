import { NextApiHandler } from "next";
import { getArticlesForListing } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName } from "../../lib/constants/cookies";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const articleType = typeof req.query.category === "string" ? [req.query.category] : req.query.category;
  const lang = req.query.language.slice(-2).toString().toUpperCase()
  const language = req.query.language.slice(0, 3).toString() + lang;
  const usePreview = parseBoolean(req.query.preview)

  const pageNumber = parseInt(page as string)
  const pageSizeN = parseInt(pageSize as string)

  if (typeof language !== "string") {
    return res.status(400).json({ error: "You have to provide 'language' query parameter" });
  }

  if (page && isNaN(pageNumber)) {
    return res.status(400).json({ error: "The value you provided for page is not a number" });
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = defaultPreviewKey;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const articles = await getArticlesForListing({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview, language as string, isNaN(pageNumber) ? undefined : pageNumber, articleType,  isNaN(pageSizeN) ? undefined : pageSizeN);

  return res.status(200).json({ articles: articles.items, totalCount: articles.pagination.totalCount });
};

export default handler;