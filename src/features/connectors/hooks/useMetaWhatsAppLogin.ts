import { useCallback, useState } from "react";
import { initFacebookSdk } from "@/lib/facebook-sdk";
import type { MetaWhatsAppLoginResult } from "../types/connectors.types";

const trustedMetaOrigins = new Set([
    "https://www.facebook.com",
    "https://web.facebook.com",
    "https://business.facebook.com",
]);

function parseEmbeddedSignupMessage(event: MessageEvent) {
    if (!trustedMetaOrigins.has(event.origin)) return null;

    if (typeof event.data === "string" && event.data.includes("code=")) {
        const params = new URLSearchParams(event.data);

        return {
            code: params.get("code") ?? undefined,
            redirectUri: params.get("origin") ?? undefined,
        };
    }

    const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;

    if (data?.type !== "WA_EMBEDDED_SIGNUP") return null;
    if (!["FINISH", "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"].includes(data.event)) {
        return null;
    }

    return {
        phoneNumberId:
            data.data?.phone_number_id ??
            data.data?.phone_number?.id ??
            data.data?.phone?.id,
        businessAccountId:
            data.data?.waba_id ??
            data.data?.business_account_id ??
            data.data?.whatsapp_business_account_id,
    };
}

export function useMetaWhatsAppLogin() {
    const [isLoading, setIsLoading] = useState(false);

    const startLogin = useCallback(async (): Promise<MetaWhatsAppLoginResult> => {
        setIsLoading(true);

        try {
            await initFacebookSdk();

            const configId = import.meta.env.VITE_FACEBOOK_CONFIG_ID;
            if (!configId) {
                throw new Error("Missing Meta configuration ID.");
            }

            let embeddedSignupResult: Partial<MetaWhatsAppLoginResult> = {};

            const removeListener = () => {
                window.removeEventListener("message", handleMessage);
            };

            const handleMessage = (event: MessageEvent) => {
                try {
                    const parsed = parseEmbeddedSignupMessage(event);
                    if (parsed) {
                        embeddedSignupResult = { ...embeddedSignupResult, ...parsed };
                    }
                } catch {
                    // Ignore unrelated Meta/browser messages.
                }
            };

            window.addEventListener("message", handleMessage);

            return await new Promise<MetaWhatsAppLoginResult>((resolve, reject) => {
                window.FB.login(
                    (response: any) => {
                        removeListener();

                        if (!response?.authResponse) {
                            reject(new Error("Meta authentication was cancelled."));
                            return;
                        }

                        const accessToken = response.authResponse.accessToken;
                        const code = response.authResponse.code;

                        if (!accessToken && !code) {
                            reject(new Error("Meta did not return usable credentials."));
                            return;
                        }

                        resolve({
                            ...embeddedSignupResult,
                            accessToken,
                            code,
                        });
                    },
                    {
                        config_id: configId,
                        extras: {
                            setup: {},
                            sessionInfoVersion: 3,
                        },
                    },
                );
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { startLogin, isLoading };
}