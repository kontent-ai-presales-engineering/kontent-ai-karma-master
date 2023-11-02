import { NextApiHandler } from "next";
import { getEventsForListing } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { envIdCookieName, previewApiKeyCookieName } from "../../lib/constants/cookies";
import { taxonomies } from "../../models";

const handler: NextApiHandler = async (req, res) => {
  const page = req.query.page;
  const eventType = typeof req.query.category === "string" ? [req.query.category] : req.query.category;
  const lang = req.query.language.slice(-2).toString().toUpperCase()
  const language = req.query.language.slice(0, 3).toString() + lang;
  const usePreview = parseBoolean(req.query.preview)

  const pageNumber = parseInt(page as string)

  if (typeof language !== "string") {
    return res.status(400).json({ error: "You have to provide 'language' query parameter" });
  }

  if (page && isNaN(pageNumber)) {
    return res.status(400).json({ error: "The value you provided for page is not a number" });
  }

  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = req.cookies[previewApiKeyCookieName];
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  const events = await getEventsForListing({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview, language as string, isNaN(pageNumber) ? undefined : pageNumber, eventType, [taxonomies.channels.terms.karma_website.codename]);

  
  return res.status(200).json({ events: events.items, totalCount: events.pagination.totalCount });
};

export default handler;