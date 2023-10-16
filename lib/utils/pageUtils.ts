import { getCookie } from "cookies-next";
import { GetStaticPropsContext, PreviewData } from "next";
import { envIdCookieName, previewApiKeyCookieName } from "../constants/cookies";
import { defaultEnvId } from "./env";

export const getEnvIdFromRouteParams = (context: GetStaticPropsContext): string => {
  const envId = context.params?.envId.toString();
  const isEnvIdPresent = typeof envId === "string" && envId !== "[object Object]";
  if (!isEnvIdPresent) {
    console.warn("No envId in the route. Falling back to envId from the environment variable.")
  }

  return isEnvIdPresent ? envId : defaultEnvId;
}

export const getPreviewApiKeyFromPreviewData = (previewData: PreviewData | undefined) =>
  previewData && typeof previewData === 'object' && previewApiKeyCookieName in previewData
    ? previewData.currentPreviewApiKey as string
    : process.env.KONTENT_PREVIEW_API_KEY;

export const getEnvIdFromCookie = () => getCookie(envIdCookieName, { path: '/', sameSite: 'none' });
