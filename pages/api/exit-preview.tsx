import { NextApiHandler } from "next";
import { ResolutionContext, resolveUrlPath } from "../../lib/routing";

const handler: NextApiHandler = (req, res) => {
    console.log("Exiting preview");
    // Exit the current user from "Preview Mode". This function accepts no args.
    res.clearPreviewData();
  
    // Redirect the user back to the index page.
    // Might be implemented return URL by the query string.
    let path = req.query.slug.toString()

    if (req.query.type) {
      path = resolveUrlPath({
        type: req.query.type.toString(),
        slug: req.query.slug.toString()
      } as ResolutionContext, req.query.lang?.toString());
    }  
    // Redirect to the path from the fetched post
    res.redirect(path);
  }

  export default handler;
