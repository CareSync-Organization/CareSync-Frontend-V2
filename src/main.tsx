import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import "./index.css";
import { router } from "./router";
import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/query-client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from './lib/theme-provider';
import { Toaster } from "sonner"

const sentryEnv = import.meta.env.VITE_SENTRY_ENV;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const enableLogs = import.meta.env.VITE_ENABLE_SENTRY_LOGS === "true";
// const enableReplay = import.meta.env.VITE_ENABLE_SENTRY_REPLAY === "true";
const sendDefaultPii = import.meta.env.VITE_SENTRY_SEND_DEFAULT_PII === "true";
const maskAllText = import.meta.env.VITE_SENTRY_MASK_ALL_TEXT === "true";
const blockAllMedia = import.meta.env.VITE_SENTRY_BLOCK_ALL_MEDIA === "true";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: sentryEnv,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: sendDefaultPii,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText, blockAllMedia }),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [apiBaseUrl, "http://127.0.0.1:8000"],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.,
  // Enable logs to be sent to Sentry
  enableLogs: enableLogs,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <TanStackRouterDevtools position="top-left" router={router} initialIsOpen={false}/>
    <Toaster richColors position="top-center"/>
    <ReactQueryDevtools />
    </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
