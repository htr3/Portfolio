/**
 * Chat boat notification settings.
 * Email alerts use FormSubmit (free) — check inbox once to activate.
 * WhatsApp alerts need CallMeBot: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
window.CHATBOT_CONFIG = {
  ownerEmail: "vishalth115@gmail.com",
  whatsappNumber: "918982762718",
  siteName: "Vishal Thakur Portfolio",

  // Optional: add your CallMeBot API key for WhatsApp visit/message alerts
  callmebotApiKey: "",

  // Notify on each new visit (once per browser session)
  notifyOnVisit: true,

  // Delay before visit ping (ms) — avoids bots inflating count
  visitNotifyDelay: 3000,
};
