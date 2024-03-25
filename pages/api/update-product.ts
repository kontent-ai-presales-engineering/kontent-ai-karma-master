import { NextApiHandler } from "next";
import axios from "axios";
import { getProductByProductId } from "../../lib/services/kontentClient";
import { defaultEnvId, defaultPreviewKey } from "../../lib/utils/env";
import KontentManagementService from "../../lib/services/kontent-management-service";
import { LanguageVariantElements } from "@kontent-ai/management-sdk";
import { contentTypes, languages, workflows } from "../../models";

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
    console.log(`Failed to get product data: ${error.message}`)
    return "";
  }
};

// Helper function to get product category
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
    console.log(`Failed to get product category: ${error.message}`)
    return "";
  }
};

// Function to create or update a product in Kontent.ai
async function archiveProduct(productId: string) {
  try {
    const kms = new KontentManagementService();
    const existingPublishedContent = await getProductByProductId({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productId, false);

    if (existingPublishedContent) {
      await kms.unpublishLanguageVariant(existingPublishedContent.system.id, languages.enGB.id)
    }
    if (!existingPublishedContent) {
      const existingContent = await getProductByProductId({ envId: defaultEnvId, previewApiKey: defaultPreviewKey }, productId, true);
      if (!existingContent) {
        console.log("Product not found to archive")
        return ""
      }
      await kms.changeLanguageVariantWorkflowStep(existingContent.system.id, languages.enGB.id, workflows.default.steps.archived.codename, workflows.default.id)
    }
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
    await kms.createNewVersionOfLanguageVariant(itemId, languages.enGB.id);
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
    await kms.upsertProductLanguageVariant(itemId, languages.enGB.id, elements);
  } catch (error) {
    throw new Error(`Failed to create or update product: ${error.message}`);
  }
}

// Main API handler
const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const payload = req.body;
      if (payload.action === 'delete') {
        // Use Promise.all to wait for all archiveProduct promises to resolve
        const archivePromises = payload.products?.map(prod => archiveProduct(prod.productId));
        await Promise.all(archivePromises);
        return res.status(200).json({ message: 'Products archived successfully' });
      }

      if (payload.action === 'create' || payload.action === 'update') {
        const productData = await getProductData(payload.primaryId);
        if (!productData) {
          return res.status(200).json({ message: 'Product not found in Pimberly' });
        }
        const productCategory = await getProductCategory(payload.primaryId);
        if (!productCategory) {
          return res.status(200).json({ message: 'Product Category not found in Pimberly' });
        }

        await createOrUpdateProduct(productData, productCategory);
        return res.status(200).json({ message: 'Product created or updated successfully' });
      }
    } catch (error) {
      console.error("Error in API handler:", error.message);
      return res.status(500).json({ message: 'Error in API handler', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;