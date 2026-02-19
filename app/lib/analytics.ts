export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

type WindowWithAnalytics = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
};

export function trackEvent(event: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const enrichedPayload = {
    event,
    ...payload,
    source: "website_v1",
    timestamp: new Date().toISOString(),
  };

  const runtimeWindow = window as WindowWithAnalytics;

  runtimeWindow.dataLayer?.push(enrichedPayload);

  if (typeof runtimeWindow.gtag === "function") {
    runtimeWindow.gtag("event", event, enrichedPayload);
  }
}
