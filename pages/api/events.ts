import { NextApiHandler } from "next";
import { getEventsForListing } from "../../lib/services/kontent-service";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
    const page = req.query.page;
    const eventType = typeof req.query.category === "string" ? [req.query.category] : req.query.category;
    const lang = req.query.language.slice(-2).toString().toUpperCase()
    const language = req.query.language.slice(0, 3).toString() + lang;
    const isPreview = parseBoolean(req.query.preview)

    const pageNumber = parseInt(page as string)

    if (typeof language !== "string") {
      return res.status(400).json({ error: "You have to provide 'language' query parameter" });
    }

    if(page && isNaN(pageNumber)){
        return res.status(400).json({ error: "The value you provided for page is not a number" }); 
    }
    
    const events = await getEventsForListing(isPreview, language as string, isNaN(pageNumber) ? undefined : pageNumber, eventType);
  
    return res.status(200).json({ events: events.items, totalCount: events.pagination.totalCount});
  };
  
  export default handler;