import { getCookie, setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BuildError } from "../components/shared/ui/BuildError";
import { webAuth } from "../lib/constants/auth";
import { mainColorTextClass } from "../lib/constants/colors";
import { envIdCookieName, previewApiKeyCookieName, urlAfterAuthCookieName } from "../lib/constants/cookies";
import { internalApiDomain, siteCodename } from "../lib/utils/env";

const CallbackPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const envId = getCookie(envIdCookieName, { path: '/', sameSite: 'none' });

    if (!internalApiDomain) {
      console.log("Enviroment variable KONTENT_DOMAIN is empty");
    }

    const getProjectContainerId = (authToken: string): Promise<string | Readonly<{ error: string }>> =>
      fetch(`${internalApiDomain}/api/project-management/${envId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })
        .then(res => res.json())
        .then(res => isIapiError(res) ? { error: res.description } : res["projectContainerId"] as string)
        .catch(() => ({ error: "Failed to fetch projects." }))

    const getTokenSeedId = async (authToken: string, projectContainerId: string): Promise<string | Readonly<{ error: string }>> => {
      const data = {
        query: '',
        'token_types': ['delivery-api'],
        environments: [envId]
      }

      const tokenSeedUrl = `${internalApiDomain}/api/project-container/${projectContainerId}/keys/listing`;
      return fetch(tokenSeedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(res => {
          if (isIapiError(res)) {
            return { error: res.description };
          }
          return res[0] ? res[0]['token_seed_id'] : { error: "There is no preview delivery API token generated for this environment." };
        })
        .catch(() => "Failed to fetch authentication keys.");
    };


    const getPreviewApiKey = async (authToken: string, projectContainerId: string): Promise<string | Readonly<{ error: string }>> => {
      const tokenSeedId = await getTokenSeedId(authToken, projectContainerId);
      if (typeof tokenSeedId !== "string") {
        return tokenSeedId;
      }

      const apiKeyUrl = `${internalApiDomain}/api/project-container/${projectContainerId}/keys/${tokenSeedId}`;

      return fetch(apiKeyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
      })
        .then(res => res.json())
        .then(res => isIapiError(res) ? { error: res.description } : res["api_key"])
        .catch(() => ({ error: "Failed to fetch authentication key." }))
    };

    webAuth.parseHash({ hash: window.location.hash }, async (err, authResult) => {
      if (err?.error && requiresLoginAuthErrors.includes(err.error)) {
        return window.location.replace(`/getPreviewApiKey?promptLogin&path=${getCookie(urlAfterAuthCookieName)}`);
      }
      if (err) {
        return setError(err.errorDescription ?? err.error);
      }
      if (!authResult?.accessToken) {
        return setError("Failed to fetch access token.");
      }
      const projectContainerId = await getProjectContainerId(authResult.accessToken);

      if (typeof projectContainerId === "object") {
        return setError(projectContainerId.error);
      }

      const api_key = await getPreviewApiKey(authResult.accessToken, projectContainerId);

      if (typeof api_key === "string") {
        setCookie(previewApiKeyCookieName, api_key, { path: '/', sameSite: 'none', secure: true })
      }
      else {
        return setError(api_key.error);
      }

      window.location.replace(authResult.appState ?? '/'); // router.replace changes the "slug" query parameter so we can't use it here, because this parameter is used when calling the /api/preview endpoint
    });
  }, [router.isReady]);

  if (error) {
    return <BuildError>{error}</BuildError>;
  }

  return <Loader />;
};

const callback = dynamic(() => Promise.resolve(CallbackPage), {
  ssr: false,
});

export default callback;

const isIapiError = (response: unknown): response is Readonly<{ description: string }> =>
  typeof response === "object" && response !== null && "description" in response && typeof response.description === "string";

const Loader = () => (
  <div
    className={`animate-spin inline-block mt-[20%] ml-[50%] w-8 h-8 border-[3px] border-current border-t-transparent ${mainColorTextClass[siteCodename]} rounded-full`}
    role="status"
    aria-label="loading"
  >
    <span className="sr-only">Loading...</span>
  </div >
);

const requiresLoginAuthErrors: ReadonlyArray<string> = ["login_required", "consent_required", "interaction_required"];
