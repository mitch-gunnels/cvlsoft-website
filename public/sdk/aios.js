(() => {
  const script = document.currentScript || Array.from(document.scripts).find((s) => /\/sdk\/aios\.js(\?|$)/.test(s.src));
  const apiBase = script?.dataset?.aiosApiBase || new URL(script ? script.src : "https://cvlsoft.com/sdk/aios.js").origin;
  const state = {
    siteId: script?.dataset?.aiosSiteId || "",
    sessionId: "",
    token: "",
    chatOpen: false,
    greetingShown: false,
    chat: null,
    messages: null,
    input: null,
    policy: { selectors: [], redactions: [] },
    chatConfig: { enabled: false, greeting: "" },
    customer: window.AIOSCustomer || undefined,
    commandTimer: 0,
    navigationHooked: false,
  };

  function summaryText(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim();
  }

  function isRedacted(el) {
    return (state.policy.redactions || []).some((rule) => {
      try {
        return el.matches(rule.selector) || Boolean(el.closest(rule.selector));
      } catch {
        return false;
      }
    });
  }

  function summarizePage() {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
      .filter((el) => !isRedacted(el))
      .map(summaryText)
      .filter(Boolean)
      .slice(0, 20);
    const sections = Array.from(document.querySelectorAll("[data-aios-section],main section,main article"))
      .filter((el) => !isRedacted(el))
      .map(summaryText)
      .filter(Boolean)
      .slice(0, 12)
      .map((text) => text.slice(0, 900));
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || undefined;
    return { title: document.title || undefined, description, headings, sections };
  }

  async function request(path, options = {}) {
    const headers = Object.assign({ "content-type": "application/json" }, options.headers || {});
    if (state.token) headers.authorization = "Bearer " + state.token;
    const res = await fetch(apiBase + path, Object.assign({}, options, { headers, credentials: "omit" }));
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw Object.assign(new Error(data.error || "AIOS request failed"), { response: data, status: res.status });
    return data;
  }

  function ensureChat() {
    if (state.chat) return state.chat;
    const host = document.createElement("div");
    host.id = "aios-web-agent";
    const root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    root.innerHTML = '<style>:host{all:initial}.wrap{position:fixed;right:20px;bottom:20px;z-index:2147483000;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033}.launcher{border:0;border-radius:999px;background:#111827;color:#fff;padding:12px 16px;font-size:14px;font-weight:650;box-shadow:0 12px 34px rgba(15,23,42,.24);cursor:pointer}.panel{display:none;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 96px));background:#fff;border:1px solid rgba(15,23,42,.14);border-radius:12px;box-shadow:0 18px 54px rgba(15,23,42,.22);overflow:hidden}.panel.open{display:grid;grid-template-rows:auto 1fr auto}.head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(15,23,42,.1);font-size:14px;font-weight:700}.close{border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer;color:#475569}.msgs{padding:14px;overflow:auto;background:#f8fafc}.msg{max-width:86%;margin:0 0 10px;padding:9px 11px;border-radius:12px;font-size:14px;line-height:1.4;white-space:pre-wrap}.agent{background:#fff;border:1px solid rgba(15,23,42,.1);color:#172033}.customer{background:#111827;color:#fff;margin-left:auto}.form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(15,23,42,.1);background:#fff}.input{flex:1;border:1px solid rgba(15,23,42,.2);border-radius:8px;padding:9px 10px;font-size:14px;min-width:0}.send{border:0;border-radius:8px;background:#111827;color:#fff;padding:0 13px;font-size:14px;font-weight:650;cursor:pointer}.toast{position:fixed;right:20px;bottom:92px;background:#111827;color:#fff;border-radius:8px;padding:10px 12px;font-size:13px;box-shadow:0 12px 34px rgba(15,23,42,.24)}.highlight{outline:3px solid #f59e0b!important;outline-offset:3px!important}@media(max-width:520px){.wrap{right:12px;bottom:12px}.panel{width:calc(100vw - 24px);height:calc(100vh - 72px)}}</style><div class="wrap"><button class="launcher" type="button">Ask AIOS</button><div class="panel" role="dialog" aria-label="AIOS chat"><div class="head"><span>AIOS</span><button class="close" type="button" aria-label="Close">x</button></div><div class="msgs"></div><form class="form"><input class="input" autocomplete="off" placeholder="Message AIOS"><button class="send" type="submit">Send</button></form></div></div>';
    document.body.appendChild(host);
    const panel = root.querySelector(".panel");
    const launcher = root.querySelector(".launcher");
    const close = root.querySelector(".close");
    const form = root.querySelector(".form");
    state.messages = root.querySelector(".msgs");
    state.input = root.querySelector(".input");
    launcher.addEventListener("click", () => openChat());
    close.addEventListener("click", () => closeChat());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = state.input.value.trim();
      if (value) sendMessage(value);
    });
    state.chat = { host, root, panel, launcher };
    return state.chat;
  }

  function appendMessage(role, content) {
    ensureChat();
    const msg = document.createElement("div");
    msg.className = "msg " + (role === "customer" ? "customer" : "agent");
    msg.textContent = content;
    state.messages.appendChild(msg);
    state.messages.scrollTop = state.messages.scrollHeight;
  }

  function openChat() {
    ensureChat();
    state.chatOpen = true;
    state.chat.panel.classList.add("open");
    state.chat.launcher.style.display = "none";
    if (!state.greetingShown && state.chatConfig.greeting) {
      appendMessage("agent", state.chatConfig.greeting);
      state.greetingShown = true;
    }
    track("chat_opened").catch(() => {});
    state.input?.focus();
  }

  function closeChat() {
    if (!state.chat) return;
    state.chatOpen = false;
    state.chat.panel.classList.remove("open");
    state.chat.launcher.style.display = "";
  }

  async function sendMessage(message) {
    if (!state.sessionId) await init();
    appendMessage("customer", message);
    state.input.value = "";
    const data = await request("/api/web-sessions/" + encodeURIComponent(state.sessionId) + "/messages", {
      method: "POST",
      body: JSON.stringify({ message, currentUrl: location.href, pageSummary: summarizePage() }),
    });
    if (data.reply) appendMessage("agent", data.reply);
    for (const command of data.commands || []) await handleCommand(command);
    return data;
  }

  async function track(type, payload = {}) {
    if (!state.sessionId) return null;
    return request("/api/web-sessions/" + encodeURIComponent(state.sessionId) + "/events", {
      method: "POST",
      body: JSON.stringify({ type, currentUrl: location.href, pageSummary: summarizePage(), payload }),
    });
  }

  function showToast(text) {
    const div = document.createElement("div");
    div.className = "toast";
    div.textContent = text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4200);
  }

  async function handleCommand(command) {
    let outcome = "completed";
    let reason = "";
    try {
      if (command.type === "navigate" && command.payload?.url) {
        const url = new URL(command.payload.url, location.href);
        if (url.origin !== location.origin) throw new Error("Cross-origin navigation blocked");
        location.assign(url.href);
      } else if (command.type === "highlight" && command.payload?.selector) {
        document.querySelectorAll(".aios-highlight").forEach((el) => el.classList.remove("aios-highlight", "highlight"));
        const el = document.querySelector(command.payload.selector);
        if (!el) throw new Error("Target not found");
        el.classList.add("aios-highlight", "highlight");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (command.type === "toast" && command.payload?.message) {
        showToast(String(command.payload.message));
      } else if (command.type === "workflow_status" && command.payload?.message) {
        appendMessage("agent", String(command.payload.message));
      }
    } catch (err) {
      outcome = "failed";
      reason = err instanceof Error ? err.message : String(err);
    }
    await request("/api/web-sessions/" + encodeURIComponent(state.sessionId) + "/commands/" + encodeURIComponent(command.commandId) + "/ack", {
      method: "POST",
      body: JSON.stringify({ outcome, reason: reason || undefined }),
    }).catch(() => {});
  }

  async function pollCommands() {
    if (!state.sessionId) return;
    try {
      const data = await request("/api/web-sessions/" + encodeURIComponent(state.sessionId) + "/commands");
      for (const command of data.commands || []) await handleCommand(command);
    } catch {}
  }

  function hookNavigation() {
    if (state.navigationHooked) return;
    state.navigationHooked = true;
    const notify = () => setTimeout(() => track("route_changed").catch(() => {}), 0);
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function (...args) { const ret = pushState.apply(this, args); notify(); return ret; };
    history.replaceState = function (...args) { const ret = replaceState.apply(this, args); notify(); return ret; };
    window.addEventListener("popstate", notify);
  }

  async function init(options = {}) {
    state.siteId = options.siteId || state.siteId;
    state.customer = options.customer || state.customer;
    if (!state.siteId) throw new Error("AIOS siteId is required");
    if (state.sessionId) return { sessionId: state.sessionId };
    const data = await request("/api/web-sessions/start", {
      method: "POST",
      body: JSON.stringify({
        siteId: state.siteId,
        currentUrl: location.href,
        referrer: document.referrer || undefined,
        pageSummary: summarizePage(),
        customer: state.customer,
      }),
    });
    state.sessionId = data.sessionId;
    state.token = data.sessionToken;
    state.policy = data.policy || state.policy;
    state.chatConfig = data.chat || state.chatConfig;
    if (state.chatConfig.enabled) ensureChat();
    hookNavigation();
    window.clearInterval(state.commandTimer);
    state.commandTimer = window.setInterval(pollCommands, 5000);
    return data;
  }

  const api = {
    init,
    openChat,
    closeChat,
    sendMessage,
    track,
    identify(customer) { state.customer = customer; },
  };
  const queued = Array.isArray(window.AIOSWebQueue) ? window.AIOSWebQueue.slice() : [];
  window.AIOS = api;
  window.AIOSWebQueue = {
    push(item) {
      if (Array.isArray(item) && api[item[0]]) return api[item[0]](...item.slice(1));
      return undefined;
    },
  };
  for (const item of queued) window.AIOSWebQueue.push(item);
  if (state.siteId && script?.dataset?.aiosAutoInit !== "false") init().catch((err) => console.warn("[AIOS]", err.message || err));
})();
