import { NextApiHandler } from "next";
import { getItemByCodename } from "../../lib/services/kontentClient";
import { envIdCookieName } from "../../lib/constants/cookies";
import { defaultPreviewKey } from "../../lib/utils/env";

const handler: NextApiHandler = async (req, res) => {
  // Check for the HTTP method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Extract language and codename from the query parameters
  const { language, codename } = req.query;

  // Validate the language and codename parameters
  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: "Please provide 'language' query parameter." });
  }
  if (!codename || typeof codename !== 'string') {
    return res.status(400).json({ error: "Please provide 'codename' query parameter." });
  }

  // Retrieve environment ID and preview API key
  const currentEnvId = req.cookies[envIdCookieName];
  const currentPreviewApiKey = defaultPreviewKey;

  // Validate the environment ID and preview API key
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing envId cookie" });
  }
  if (!currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing previewApiKey cookie" });
  }

  try {
    // Fetch the item by codename from Kontent.ai
    const data = await getItemByCodename(
      { envId: currentEnvId, previewApiKey: currentPreviewApiKey },
      codename,
      true,
      language
    );

    // Check if the image element exists and has a value
    if (!data.elements.image || !data.elements.image.value || data.elements.image.value.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Respond with the image URL
    const imageUrl = data.elements.image.value[0].url;
    return res.status(200).json({ imageUrl });
  } catch (error) {
    // Handle errors from the Kontent.ai client or other issues
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;