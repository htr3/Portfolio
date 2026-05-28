(function () {
  const cfg = window.CHATBOT_CONFIG || {};
  const email = cfg.ownerEmail || "";
  const whatsapp = (cfg.whatsappNumber || "").replace(/\D/g, "");
  const visitKey = "portfolio_visit_notified";

  function el(id) {
    return document.getElementById(id);
  }

  function formatTime() {
    return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  }

  function visitorInfo(extra) {
    const lines = [
      `Time: ${formatTime()}`,
      `Page: ${location.href}`,
      `Referrer: ${document.referrer || "Direct visit"}`,
      `Device: ${navigator.userAgent}`,
    ];
    if (extra) lines.unshift(extra, "---");
    return lines.join("\n");
  }

  async function sendEmail(subject, message) {
    if (!email) return false;
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          message: message,
          _template: "table",
          _captcha: "false",
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function sendWhatsApp(text) {
    const key = cfg.callmebotApiKey;
    if (!key || !whatsapp) return false;
    try {
      const url =
        "https://api.callmebot.com/whatsapp.php?" +
        new URLSearchParams({
          phone: whatsapp,
          text: text.slice(0, 1200),
          apikey: key,
        });
      const res = await fetch(url);
      return res.ok;
    } catch {
      return false;
    }
  }

  async function notifyOwner(type, detail) {
    const subject = `[Portfolio] ${type} — ${cfg.siteName || "Website"}`;
    const body = visitorInfo(detail);

    await sendEmail(subject, body);

    if (cfg.callmebotApiKey) {
      await sendWhatsApp(`${type}\n\n${body}`);
    }
  }

  function notifyVisit() {
    if (!cfg.notifyOnVisit) return;
    if (sessionStorage.getItem(visitKey)) return;
    sessionStorage.setItem(visitKey, "1");

    const delay = cfg.visitNotifyDelay ?? 3000;
    setTimeout(() => {
      notifyOwner("New visitor", "Someone opened your portfolio website.");
    }, delay);
  }

  function initWidget() {
    const toggle = el("boat-toggle");
    const panel = el("boat-panel");
    const closeBtn = el("boat-close");
    const form = el("boat-form");
    const status = el("boat-status");

    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", () => {
      setOpen(!panel.classList.contains("is-open"));
    });

    closeBtn?.addEventListener("click", () => setOpen(false));

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = el("boat-name")?.value?.trim() || "Anonymous";
      const msg = el("boat-message")?.value?.trim() || "";
      if (!msg) {
        if (status) status.textContent = "Please type a message first.";
        return;
      }

      if (status) status.textContent = "Sending…";
      const detail = `Visitor name: ${name}\nMessage: ${msg}`;
      const ok = await sendEmail(`Message from ${name}`, visitorInfo(detail));
      if (cfg.callmebotApiKey) {
        await sendWhatsApp(`Portfolio message from ${name}:\n${msg}`);
      }

      if (status) {
        status.textContent = ok
          ? "Sent! Vishal will get back to you soon."
          : "Could not send — try WhatsApp or email below.";
      }
      form.reset();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initWidget();
      notifyVisit();
    });
  } else {
    initWidget();
    notifyVisit();
  }
})();
