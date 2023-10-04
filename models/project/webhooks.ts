/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Project name: ⚒ EliteBuild Manufacturing - Master
 * Environment: Production
 * Project Id: 70a09beb-cba0-01b9-425e-a7af1bd1112f
 */
export const webhooks = {
  /**
   * Automatic Translation
   */
  automaticTranslation: {
    url: 'https://elitebuild.kontent.dev/api/translate-webhook/',
    id: '46411475-194e-455d-95f8-5612112c92ef',
    name: 'Automatic Translation',
  },

  /**
   * End Trial
   */
  endTrial: {
    url: 'https://elitebuild.kontent.dev/api/remove-environment/',
    id: '26a6d712-bf22-4e5b-97b4-c8251f3c4778',
    name: 'End Trial',
  },
} as const;
