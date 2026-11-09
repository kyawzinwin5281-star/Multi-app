const CACHE_NAME = 'multi-app-v1.0.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Service Worker တပ်ဆင်ခြင်းနှင့် Cache ပြုလုပ်ခြင်း
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Version အသစ်ထွက်တာနဲ့ ချက်ချင်း အစားထိုး အလုပ်လုပ်မည်
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Version အဟောင်းများကို ရှင်းထုတ်ခြင်း
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Push Notification လာသည့်အခါ အလိုအလျောက် ပေါ့ပ်အပ် တက်စေခြင်း
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Multi App Notification';
  const options = {
    body: data.body || 'စာလေ့လာရန် အချိန်ရောက်ပါပြီ။',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200], // ဖုန်း တုန်ခါမှု ပုံစံ
    requireInteraction: true, // အသုံးပြုသူ ကိုယ်တိုင် ပွတ်ဆွဲမပိတ်မချင်း ပေါ်နေမည်
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification ကို နှိပ်လိုက်ပါက App ဖွင့်ပေးခြင်း
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
