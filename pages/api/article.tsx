import { NextApiHandler } from "next";
import { getItemByUrlSlug } from "../../lib/services/kontent-service";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { Article, contentTypes } from "../../models";

const handler: NextApiHandler = async (req, res) => {
  const pageSlug = req.query.slug;
  if (typeof pageSlug !== "string") {
    return res.status(400).json({ error: "You have to provide 'slug' query parameter with the page's url slug." });
  }

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
  const data = await getItemByUrlSlug<Article>(pageSlug, "url", usePreview, language as string);

  res.status(200).json(data);
}

export default handler;