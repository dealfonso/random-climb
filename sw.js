var cacheName = 'random-climb';
var filesToCache = [
  'index.html',
  'random.html',
  'manifest.json',
  'favicon.ico',
  'css/style.css',
  'js/main.js',
  'js/randomizeit.js',
  'js/textit.js',
  'js/randomclimb.js',
  'images/transparent_1024.png',
  'images/icons/icon-144x144.png',
  'images/presas/amarilla.png',
  'images/presas/azul-p.png',
  'images/presas/azul.png',
  'images/presas/verde.png',
  'images/presas/morada-g.png',
  'images/presas/morada-clara.png',
  'images/presas/naranja.png',
  'vendor/jquery-3.4.1.min.js',
  'vendor/popper.js/popper.min.js',
  'vendor/bootstrap/4.1.1/css/bootstrap.min.css',
  'vendor/fontawesome-free-5.12.0-web/css/fontawesome.min.css',
  'vendor/fontawesome-free-5.12.0-web/css/brands.min.css',
  'vendor/fontawesome-free-5.12.0-web/css/solid.min.css',
  'vendor/bootstrap/4.1.1/js/bootstrap.min.js',
  'vendor/fontawesome-free-5.12.0-web/webfonts/fa-solid-900.ttf',
  'vendor/fontawesome-free-5.12.0-web/webfonts/fa-solid-900.woff',
  'vendor/fontawesome-free-5.12.0-web/webfonts/fa-solid-900.woff2',
  'sound/manoderecha.mp3',
  'sound/moradaclara.mp3',
  'sound/pieizquierdo.mp3',
  'sound/azulpequena.mp3',
  'sound/verde.mp3',
  'sound/moradapequena.mp3',
  'sound/azul.mp3',
  'sound/manoizquierda.mp3',
  'sound/amarilla.mp3',
  'sound/morada.mp3',
  'sound/azulgrande.mp3',
  'sound/moradagrande.mp3',
  'sound/piederecho.mp3',
  'sound/moradaalargada.mp3',
  'sound/naranja.mp3'  
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      //return 
      cache.addAll(filesToCache).then(function() {
        console.log('ficheros en cache');
      }).catch(function(e) {
        console.error('fallo al cargar los ficheros', e)
      })
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});