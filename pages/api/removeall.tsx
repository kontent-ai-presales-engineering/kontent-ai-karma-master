import { ManagementClient } from "@kontent-ai/management-sdk";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {

  const client = new ManagementClient({
    environmentId: "190492f3-b501-0165-547f-11270c3e479a",
    apiKey: "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImQ1MjQ3MmMwZWMxNDQxOGFiYzliZDNlOTI3ZmM2MTQ5IiwNCiAgImlhdCI6ICIxNzA2NzkwNDQyIiwNCiAgImV4cCI6ICIxNzIyNTExNjIwIiwNCiAgInZlciI6ICIzLjAuMCIsDQogICJ1aWQiOiAidmlydHVhbF82Y2VmMzM3ZS1hNTFiLTQwNDMtOWU4ZC0xMzdlZDc2NjEzOTgiLA0KICAic2NvcGVfaWQiOiAiYmNkNTgyZDk0YjEyNDhhM2I0OTQ2MzI5MmU1YzI1NDIiLA0KICAicHJvamVjdF9jb250YWluZXJfaWQiOiAiOTEyMjg2ZDg2MzgzMDEwZTA4OGI0MTNhNTgzOTJhYmUiLA0KICAiYXVkIjogIm1hbmFnZS5rZW50aWNvY2xvdWQuY29tIg0KfQ.A1ibv5rhKDYiEY5MUhcy7ie-B8zVVLWf-yr9g5Glzbc"
  })
  const response = await client.listContentItems().toPromise()

// Helper function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to delete content items with respect to rate limits
async function deleteContentItems() {
  try {
    const response = await client.listContentItems().toPromise();
    for (const item of response.data.items) {
      console.log(`Deleting item with ID: ${item.id}`);
      await client.deleteContentItem().byItemId(item.id).toPromise();
      // Delay between delete requests to avoid hitting rate limits
      await delay(1000); // 10 seconds delay
    }
  } catch (e) {
    console.error(e);
  }
}

// Call the function to start deleting content items
deleteContentItems();


  res.status(200).json("all deleted");
}

export default handler;