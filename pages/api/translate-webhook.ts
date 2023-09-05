import { NextApiRequest, NextApiResponse } from "next"
import TranslationService from "../../lib/services/translation-service"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  if (req && req.body) {
    const notification = req.body as WebhookNotification
    const isValidRequest = notification && notification.message && notification.message.operation && notification.message.operation === "change_workflow_step"

    if (!isValidRequest) {
      res.status(200).end()
      return
    }

    let itemsToProcess: any[] = []

    await notification.data.items.forEach(item => {
      const itemId = item.item.id
      const languageId = item.language.id
      const workflowStepId = item.transition_to.id

      const ts = new TranslationService()
      itemsToProcess.push(ts.handleTranslation({ itemId, languageId, workflowStepId }))
    })

    console.log(`Kicking off processing ${itemsToProcess.length} items`)
    await Promise.all(itemsToProcess)
    console.log(`Finished processing ${itemsToProcess.length} items`)
  }

  res.status(200).end()
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