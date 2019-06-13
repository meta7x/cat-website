/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "af0497d3e17bc75252249ad53f4b5542"
  },
  {
    "url": "admin/index.html",
    "revision": "1c5e1116911b9a25caf9eaf5a922dd43"
  },
  {
    "url": "assets/css/0.styles.80af9f2b.css",
    "revision": "7f9834b29fdde73880492a878865acb8"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.8945714f.js",
    "revision": "2d67d38fb6bfa4f3d11154519b0b347e"
  },
  {
    "url": "assets/js/11.a14dd1f9.js",
    "revision": "ce14f98ed2f00892c77375440c42693c"
  },
  {
    "url": "assets/js/12.1e76eb83.js",
    "revision": "adaee423d94dc02fb75a60a5c03eca2d"
  },
  {
    "url": "assets/js/13.71276d3b.js",
    "revision": "8a06c75d936d3595bc0d8f92acd52c22"
  },
  {
    "url": "assets/js/2.e3a3dd50.js",
    "revision": "34ac9de6e9b30637a2c680c61afe798f"
  },
  {
    "url": "assets/js/3.a69375c2.js",
    "revision": "b21d628650598c229df07e4ecb54309a"
  },
  {
    "url": "assets/js/4.c4221eb3.js",
    "revision": "9e83aafbf6d69bd00ec58066c72f8789"
  },
  {
    "url": "assets/js/5.4f0ab59d.js",
    "revision": "b57341d24c97d84448a4cdb116c91e7b"
  },
  {
    "url": "assets/js/6.780676b2.js",
    "revision": "1f32e43272e1a06e292d3116105d9849"
  },
  {
    "url": "assets/js/7.45037168.js",
    "revision": "409d26c642510762f95f7f0a13a46fe7"
  },
  {
    "url": "assets/js/8.efab8152.js",
    "revision": "578b99063b843cdff7637dc1501f602f"
  },
  {
    "url": "assets/js/9.b6459692.js",
    "revision": "7648dac2f9de26729d7a13ffed79019f"
  },
  {
    "url": "assets/js/app.c35b05fb.js",
    "revision": "89f4b3d19b1d92132d00297a02bd57ac"
  },
  {
    "url": "cat-kontur.png",
    "revision": "4784265bd4a9d7c899388a8a442f056b"
  },
  {
    "url": "config/index.html",
    "revision": "ece8e6a4629e99bf5d98b0bb7fa1e18c"
  },
  {
    "url": "guide/index.html",
    "revision": "1b0c1a7e7328e392feca47c8a865ed8f"
  },
  {
    "url": "guide/using-vue.html",
    "revision": "0a6b07a29e145ad01a77e02cd6bb1d04"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "22de076c61ed8b65d59cc2d1f4cce323"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "4467919ed8c6c7b553c916db72ca1d12"
  },
  {
    "url": "index.html",
    "revision": "7c94d7c81a987d852725c0ee3234e3d1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
