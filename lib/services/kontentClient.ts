import { camelCasePropertyNameResolver, createDeliveryClient } from '@kontent-ai/delivery-sdk';
import getEnvironmentId from '../utils/getEnvironmentId';

const sourceTrackingHeaderName = 'X-KC-SOURCE'
const envId = getEnvironmentId();
if (!envId) {
  throw new Error("Missing 'NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID' environment variable.");
}

export const deliveryClient = createDeliveryClient({
  environmentId: envId,
  globalHeaders: (_queryConfig) => [
    {
      header: sourceTrackingHeaderName,
      value: `${process.env.APP_NAME || "n/a"};${process.env.APP_VERSION || "n/a"}`,
    },
  ],
  propertyNameResolver: camelCasePropertyNameResolver,
  proxy: {
    baseUrl: "https://deliver.kontent.ai",
    basePreviewUrl: "https://preview-deliver.kontent.ai",
  },
  previewApiKey: process.env.NEXT_PUBLIC_KONTENT_PREVIEW_API_KEY
});

