(function () {
  const ENDPOINT = "https://dfwgv-bgg-proxy.joemsprague.workers.dev/api/v";

  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    return;
  }

  function getSessionId() {
    const key = "dfwgv_session_id";
    let sessionId = sessionStorage.getItem(key);

    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      sessionStorage.setItem(key, sessionId);
    }

    return sessionId;
  }

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
      const value = params.get(key);
      if (value) {
        result[key] = value.slice(0, 120);
      }
    });

    return result;
  }

  function buildPayload() {
    return {
      event: "page_view",
      page: window.location.pathname,
      query: window.location.search.slice(0, 300),
      title: document.title,
      referrer: document.referrer ? document.referrer.slice(0, 500) : "",
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenWidth: window.screen ? window.screen.width : null,
      screenHeight: window.screen ? window.screen.height : null,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      utm: getUtmParams()
    };
  }

  function sendPageView() {
    const body = JSON.stringify(buildPayload());

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ENDPOINT, blob)) {
        return;
      }
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sendPageView, { once: true });
  } else {
    sendPageView();
  }
})();
