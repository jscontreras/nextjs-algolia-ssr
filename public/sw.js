let count = 0;
let payloads = [];
let lastMessage = Date.now();
const channel = new BroadcastChannel('app-channel');


self.addEventListener('install', function (event) {
  console.log("SW: Installed!1!");
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
  console.log('SW:Activated!!')
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('update', function (event) {
  console.log('SW:Updated!!')
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

const extractPayload = async(request) => {
  const body = await request.json()
  const url = request.url
  payloads.push({url, body});
  channel.postMessage({ action: 'algolia', payload: { payloads, url } });
}


self.addEventListener('fetch', function (event) {
  if (/algolia\.net/.test(event.request.url)) {
    console.log('WS: Algolia Intercepted');
    event.waitUntil(extractPayload(event.request))
  }
})


self.addEventListener("message", event => {
  const {action, payload={}} = event.data;
  const ms = Date.now();

  if (action === 'echo') {
    if (ms - lastMessage > 2000) {
      lastMessage = ms;
      const message = payload.message;
      count++;
      channel.postMessage({ action: 'echoed', payload: `${count} ${message}!!` });
    }

  }
  else if (action === 'getPreviousUrls') {
    channel.postMessage({ action: 'algolia', payload: { payloads, url: payloads.length > 0 ? payloads.pop.url: '' } });
  }
  else if (action === 'cleanCallbacks') {
    payloads = [];
    channel.postMessage({ action: 'algolia', payload: { payloads, url: payloads.length > 0 ? payloads.pop.url : '' } });
  }
});

