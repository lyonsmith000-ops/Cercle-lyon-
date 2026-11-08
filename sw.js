// Service worker : reçoit les notifications et les affiche
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; }
  catch (e) { d = { titre: "Lyon Cercle Story", corps: event.data ? event.data.text() : "Nouveau message" }; }
  const titre = d.titre || "Lyon Cercle Story";
  event.waitUntil(self.registration.showNotification(titre, {
    body: d.corps || "Tu as reçu un nouveau message.",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.conv ? "conv-" + d.conv : "message",
    renotify: true,
    data: { conv: d.conv || null }
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const liste = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of liste) {
      if ("focus" in c) { await c.focus(); return; }
    }
    if (self.clients.openWindow) await self.clients.openWindow("./");
  })());
});
