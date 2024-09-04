import Api2Pdf from 'api2pdf';
import { api2pdfKey } from '../../lib/utils/env';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const a2pClient = new Api2Pdf(api2pdfKey);

  try {
    const result = await a2pClient.chromeUrlToPdf(url);
    console.log(result); // Log the successful API call
    res.redirect(result.FileUrl);
  } catch (error) {
    console.log(error); // Log any errors
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}