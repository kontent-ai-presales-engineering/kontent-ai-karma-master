import { NextApiHandler } from "next";
import axios from "axios";
import { getProductByProductId } from "../../lib/services/kontentClient";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";
import KontentManagementService from "../../lib/services/kontent-management-service";
import { LanguageVariantElements } from "@kontent-ai/management-sdk";
import { contentTypes, workflows } from "../../models";

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
async function archiveProduct(productId: string) {
  console.log("archiveProduct")
  console.log(productId)
  try {
    const kms = new KontentManagementService();
    const existingPublishedContent = await getProductByProductId({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productId, false);
    if (existingPublishedContent)
    {
      console.log("existingPublishedContent")
      console.log(existingPublishedContent)
      await kms.unpublishLanguageVariant(existingPublishedContent.system.id, existingPublishedContent.system.language)
    }    
    const existingContent = await getProductByProductId({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productId, true);
    console.log("existingContent")
    console.log(existingContent)
    if (!existingContent) {
      throw new Error(`Product not found to archive`);
    }
    await kms.changeLanguageVariantWorkflowStep(existingContent.system.id, existingContent.system.language, workflows.default.steps.archived.codename, workflows.default.steps.archived.id)
  } catch (error) {
    throw new Error(`Failed to archive product: ${error.message}`);
  }
}

// Function to create or update a product in Kontent.ai
async function createOrUpdateProduct(productData: any, ProductCategory: any) {
  const kms = new KontentManagementService();
  const existingContent = await getProductByProductId({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productData._id, true);

  let itemId = existingContent?.system.id;

  if (existingContent?.system.workflowStep == "published") {
    await kms.createNewVersionOfLanguageVariant(itemId, "00000000-0000-0000-0000-000000000000");
  }

  if (!existingContent) {
    // Create new content item
    const upsertResult = await kms.createContentItem(productData.ItemName, contentTypes.product.codename);
    itemId = upsertResult?.id;
  }
  else {
    // Update new content item
    await kms.updateContentItem(productData.ItemName, itemId);
  }

  const elements: Array<LanguageVariantElements.ILanguageVariantElementBase> = [
    {
      element: { codename: contentTypes.product.elements.title.codename },
      value: productData.ItemName ? productData.ItemName : ""
    },
    {
      element: { codename: contentTypes.product.elements.sku.codename },
      value: productData.PrimaryID ? productData.primaryId : ""
    },
    {
      element: { codename: contentTypes.product.elements.model.codename },
      value: productData.ProductModel ? productData.ProductModel : ""
    },
    {
      element: { codename: contentTypes.product.elements.description.codename },
      value: productData.ProductDescription ? `<p>${productData.ProductDescription}</p>` : ""
    },
    {
      element: { codename: contentTypes.product.elements.pimberly_images.codename },
      value: productData.Images ? productData.Images.toString() : ""
    },
    {
      element: { codename: contentTypes.product.elements.productid.codename },
      value: productData._id ? productData._id : ""
    },
    {
      element: {
        codename: contentTypes.product.elements.product_category.codename
      },
      value: ProductCategory && ProductCategory.data[0] ? [
        {
          codename: ProductCategory.data[0]?.path?.toLowerCase().replaceAll(" ", "_")
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
      if (payload.action == "delete") {
        console.log("delete")
        console.log(payload.products)
        payload.products?.forEach(async prod => {
          console.log(prod)
          await archiveProduct(prod.productId);
          res.status(200).json({ message: 'Product archived successfully' });
        });
      }
      const productData = await getProductData(payload.primaryId);
      const ProductCategory = await getProductCategory(payload.primaryId);

      // Await the response from createOrUpdateProduct
      await createOrUpdateProduct(productData, ProductCategory);

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