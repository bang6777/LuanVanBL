importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({clientsClaim: true})
workboxSW.precache([
  {
    "url": "favicon-32x32.png",
    "revision": "7b1da026f1c9dc9d8caadbe4bdb7b2a8"
  },
  {
    "url": "index.html",
    "revision": "2b07fb0274669ea5b12b841f1bf7f45f"
  }
])

workboxSW.router.registerRoute(
  /\.js|\.png|\.wasm$/,
  workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'staleWhileRevalidateContent',
  cacheExpiration: {
    maxEntries: 50,
    maxAgeSeconds: 7 * 24 * 60 * 60 * 26,
    }
  })
);
