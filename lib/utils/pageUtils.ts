import { getCookie } from "cookies-next";
import { GetStaticPropsContext, PreviewData } from "next";
import { defaultCookieOptions, personaCookieName } from "../constants/cookies";
import { defaultEnvId } from "./env";

export const getPreviewApiKeyFromPreviewData = (previewData: PreviewData | undefined) =>
  previewData && typeof previewData === 'string'
    ? previewData
    : undefined;


export const getEnvIdFromCookie = () => defaultEnvId;
export const getPersonaFromCookie = () => getCookie(personaCookieName, defaultCookieOptions);