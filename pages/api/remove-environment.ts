import { NextApiRequest, NextApiResponse } from "next"
import KontentManagementService from "../../lib/services/kontent-management-service"
import VercelService from "../../lib/services/vercel-service"
import EnvironmentService from "../../lib/services/environment-service"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for POST method
  if (req.method !== "POST") {
    console.log("Not a POST request")
    return res.status(405).end()
  }

  if (req && req.body) {
    const notification = req.body as WebhookNotification
    const isValidRequest = notification && notification.message && notification.message.operation && notification.message.operation === "change_workflow_step"

    if (!isValidRequest) {
      res.status(200).end()
      return
    }

    // Initialize services
    const envService = new EnvironmentService()
    const vercel = new VercelService()

    let itemsToProcess: any[] = []

    await notification.data.items.forEach(item => {
      const itemId = item.item.id
      itemsToProcess.push(envService.removeEnvironment(itemId))
    })
    console.log(`Kicking off processing ${itemsToProcess.length} items`)
    await Promise.all(itemsToProcess)
    console.log(`Finished processing ${itemsToProcess.length} items`)
  }  
}

export interface CreateEnvironmentRequest {
  environment_id: string;
  domain_url: string;
}

export interface Item {
  id: string;
}

export interface Language {
  id: string;
}

export interface TransitionFrom {
  id: string;
}

export interface TransitionTo {
  id: string;
}

export interface WorkflowEventItem {
  item: Item;
  language: Language;
  transition_from: TransitionFrom;
  transition_to: TransitionTo;
}

export interface Data {
  items: WorkflowEventItem[];
}

export interface Message {
  id: string;
  project_id: string;
  type: string;
  operation: string;
  api_name: string;
  created_timestamp: Date;
  webhook_url: string;
}

export interface WebhookNotification {
  data: Data;
  message: Message;
}