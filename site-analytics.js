(function () {
  const ENDPOINT = "https://dfwgv-bgg-proxy.joemsprague.workers.dev/api/v";

  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    return;
  }

  function newSessionId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  }

  function getSessionId() {
    const key = "dfwgv_session_id";

    // sessionStorage throws when the visitor blocks site data; still count the
    // view, as a session of its own.
    try {
      let sessionId = sessionStorage.getItem(key);

      if (!sessionId) {
        sessionId = newSessionId();
        sessionStorage.setItem(key, sessionId);
      }

      return sessionId;
    } catch {
      return newSessionId();
    }
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
    // fetch, not sendBeacon: EasyPrivacy (uBlock Origin, Brave) blocks every beacon
    // to another domain (*$ping,third-party). The string body goes as text/plain,
    // so there's no CORS preflight, and without credentials the worker's CORS
    // headers are enough.
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(buildPayload()),
      keepalive: true,
      credentials: "omit"
    }).catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sendPageView, { once: true });
  } else {
    sendPageView();
  }
})();
