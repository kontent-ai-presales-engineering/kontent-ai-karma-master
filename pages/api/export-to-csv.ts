import { NextApiHandler } from "next";
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { getContentType, getAllItemByType } from "../../lib/services/kontentClient";
import { parseBoolean } from "../../lib/utils/parseBoolean";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';

// Function to transform content items to CSV rows
function transformItemsToCsvRows(items: any[], elements: any[]): any[] {
  return items.map(item => {
    const row: any = {};
    elements.forEach(element => {
      row[element.codename] = item.elements[element.codename]?.value || '';
      // Handle different element types accordingly
    });
    return row;
  });
}

// Function to create CSV headers based on content type elements
function createCsvHeaders(elements: any[]): any[] {
  return elements.map(element => {
    return { id: element.codename, title: element.name.toUpperCase() };
  });
}

const handler: NextApiHandler = async (req, res) => {
  const contentTypeCodeName = req.query.contenttype;
  if (typeof contentTypeCodeName !== "string") {
    return res.status(400).json({ error: "You have to provide 'contentType' query parameter with the page's url slug." });
  }

  const language = req.query.language?.toString();
  if (!language) {
    return res.status(400).json({ error: "Please provide 'language' query parameter." });
  }

  const usePreview = parseBoolean(req.query.preview);
  if (usePreview === null) {
    return res.status(400).json({ error: "Please provide 'preview' query parameter with value 'true' or 'false'." });
  }

  const currentEnvId = defaultEnvId;
  const currentPreviewApiKey = defaultPreviewKey;
  if (!currentEnvId) {
    return res.status(400).json({ error: "Missing 'envId' configuration." });
  }

  if (usePreview && !currentPreviewApiKey) {
    return res.status(400).json({ error: "Missing 'previewApiKey' configuration." });
  }

  try {
    const contentType = await getContentType({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, contentTypeCodeName);
    const headers = createCsvHeaders(contentType.data.type.elements);
    
    const tempFilePath = join(tmpdir(), `export-${contentTypeCodeName}.csv`);
    const csvWriter = createCsvWriter({
      path: tempFilePath,
      header: headers,
    });
    
    const data = await getAllItemByType({ envId: currentEnvId, previewApiKey: currentPreviewApiKey }, usePreview, contentTypeCodeName, language);

    const csvRows = transformItemsToCsvRows(data, contentType.data.type.elements);
    await csvWriter.writeRecords(csvRows);

    const csvContent = await fs.readFile(tempFilePath, 'utf-8');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=export-${contentTypeCodeName}.csv`);
    res.status(200).send(csvContent);

    await fs.unlink(tempFilePath); // Clean up the temp file
  } catch (error) {
    console.error('Error exporting content items to CSV:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;