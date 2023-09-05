import { NextApiHandler } from "next";

import { getItemByCodename } from "../../lib/services/kontent-service";
import { PerCollection } from "../../lib/types/perCollection";
import { parseBoolean } from "../../lib/utils/parseBoolean";

const handler: NextApiHandler = async (req, res) => {
  const productCodename = req.query.codename;
  if (typeof productCodename !== "string") {
    return res.status(400).json({ error: "You have to provide 'codename' query parameter with the product's codename." });
  }


  const lang = req.query.language?.slice(-2).toString().toUpperCase()
  const language = req.query.language?.slice(0, 3).toString() + lang;
  if (typeof language !== "string") {
    return res.status(400).json({ error: "You have to provide 'language' query parameter" });
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const product = await getItemByCodename(forAllCodenames(productCodename), usePreview, language as string);

  return res.status(200).json({ product });
};

const forAllCodenames = (value: string): PerCollection<string> => ({
  corporate_site: value,
  elitebuild: value,
  support: value,
  pdf: value,
  default: value,
});

export default handler;
