import { NextApiRequest, NextApiResponse } from "next"
import TranslationService from "../../lib/services/translation-service"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  if (req && req.body) {
    const webhook = req.body as WebhookNotifications;
    const isValidRequest = webhook.notifications && webhook.notifications[0].message && webhook.notifications[0].message.action && webhook.notifications[0].message.action === "workflow_step_changed"

    if (!isValidRequest) {
      res.status(200).end()
      return
    }

    let itemsToProcess: any[] = []

    await webhook.notifications.forEach(notification => {
      const itemId = notification.data.system.id
      const language = notification.data.system.language


      const ts = new TranslationService()
      itemsToProcess.push(ts.handleTranslation({ itemId, language }))
    })

    console.log(`Kicking off processing ${itemsToProcess.length} items`)
    await Promise.all(itemsToProcess)
    console.log(`Finished processing ${itemsToProcess.length} items`)
  }

  res.status(200).end()
}

export interface WorkflowEventItem {
  id: string;
  name: string;
  codename: string;
  collection: string;
  workflow: string;
  workflow_step: string;
  language: string;
  type: string;
  last_modified: string;
}

export interface Data {
  system: WorkflowEventItem;
}

export interface Message {
  environment_id: string;
  object_type: string;
  action: string;
  delivery_slot: string;
}

export interface WebhookNotification {
  data: Data;
  message: Message;
}

export interface WebhookNotifications {
  notifications: WebhookNotification[];
}