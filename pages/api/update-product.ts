import { NextApiHandler } from "next";
import axios from "axios";
import { getProductBySku } from "../../lib/services/kontentClient";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";
import KontentManagementService from "../../lib/services/kontent-management-service";
import { LanguageVariantElements } from "@kontent-ai/management-sdk";
import { contentTypes } from "../../models";

// Helper function to get product data
const getProductData = async (primaryId: string) => {
  try {
    const { data } = await axios.get(
      `https://sandbox-api.pimberly.io/core/products/${primaryId}`,
      {
        headers: {
          Authorization: `${process.env.PIMBERLY_API_KEY}`
        }
      }
    );
    return data;
  } catch (error) {
    // Improved error handling
    throw new Error(`Failed to get product data: ${error.message}`);
  }
};

// Helper function to get product data
const getProductCategory = async (primaryId: string) => {
  try {
    const { data } = await axios.get(
      `https://sandbox-api.pimberly.io/core/products/${primaryId}/classes`,
      {
        headers: {
          Authorization: `${process.env.PIMBERLY_API_KEY}`
        }
      }
    );
    return data;
  } catch (error) {
    // Improved error handling
    return ""
  }
};

// Function to create or update a product in Kontent.ai
async function createOrUpdateProduct(productData: any, ProductCategory: any) {
  const kms = new KontentManagementService();
  const existingContent = await getProductBySku({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productData.primaryId, true);

  let itemId = existingContent?.system.id;

  if (existingContent?.system.workflowStep == "published")
  {
    await kms.createNewVersionOfLanguageVariant(itemId, "00000000-0000-0000-0000-000000000000");
  }

  if (!existingContent) {
    // Create new content item
    const upsertResult = await kms.createContentItem(productData.ItemName, contentTypes.product.codename);
    itemId = upsertResult?.id;
  }
  else
  {
    // Update new content item
    await kms.updateContentItem(productData.ItemName, itemId);    
  }

  const elements: Array<LanguageVariantElements.ILanguageVariantElementBase> = [
    {
      element: { codename: 'title' },
      value: productData.ItemName
    },
    {
      element: { codename: 'sku' },
      value: productData.primaryId
    },
    {
      element: { codename: 'sellingcasepack' },
      value: productData.SellingCasePack ? productData.SellingCasePack : ""
    },
    {
      element: { codename: 'palletti' },
      value: Number(productData.PalletTi)
    },
    {
      element: { codename: 'pallethi' },
      value: Number(productData.PalletHi)
    },
    {
      element: { codename: 'innergtin' },
      value: productData.InnerGTIN ? productData.InnerGTIN : ""
    },
    {
      element: { codename: 'casegrossweight' },
      value: productData.CaseGrossWeight ? productData.CaseGrossWeight : ""
    },
    {
      element: { codename: 'caselength' },
      value: Number(productData.CaseLength)
    },
    {
      element: { codename: 'casewidth' },
      value: Number(productData.CaseWidth)
    },
    {
      element: { codename: 'caseheight' },
      value: Number(productData.CaseHeight)
    },
    {
      element: { codename: 'masterupc' },
      value: productData.MasterUPC ? productData.MasterUPC : ""
    },
    {
      element: { codename: 'description' },
      value: productData.ProductDescription ? `<p>${productData.ProductDescription}</p>` : ""
    },
    {
      element: {
        codename: 'product_category'
      },
      value: ProductCategory && ProductCategory.data[0] ? [
        {
          codename: ProductCategory.data[0]?.path?.toLowerCase().replace(" ", "_")
        }
      ] : []
    }
  ];
  try {
    await kms.upsertProductLanguageVariant(itemId, "00000000-0000-0000-0000-000000000000", elements);
  } catch (error) {
    throw new Error(`Failed to create or update product: ${error.message}`);
  }
}

// Main API handler
const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Extract the payload from the request body
      const payload = req.body;
      console.log(payload)
      const productData = await getProductData(payload.primaryId);
      
      console.log(productData)
      // const ProductCategory = await getProductCategory(payload.primaryId);

      // // Await the response from createOrUpdateProduct
      // await createOrUpdateProduct(productData, ProductCategory);

      // Send back a success response
      res.status(200).json({ message: 'Product created or updated successfully' });
    } catch (error) {
      console.error("Error in API handler:", error.message);
      res.status(500).json({ message: 'Error in API handler', error: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;