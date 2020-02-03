# random-climb

A proof of concept of a Progressive Web Application. In this case, this app genereates random movements for an indoor climbing session.

## Tech tips

### Creating a PWA

Creating a Progressive Web Application basically consists of giving an offline user-experience to the user, so that he can continue using the application even if there is no internet connection. This is made by using "Service Workers" (which are widely supported).

In my case, I have used PWA just to have a caché of the files needed by the application. So, when the application is "installed" (accessed with the browser), the files needed are automatically downloaded and cached for further usage. A PWA is much more than what this app does (a PWA means to temporary store information that has to be uploaded when the connection is restored, keep file uploads if needed, and so on, which is very complex). But using the cache is enough for my purposes of testing the technology.

In this case, creating the cached web application means to create the `manifest.json` file (whose syntax and content is widely documented), and adding this piece of code in the web page (to register the service worker):

```javascript
window.onload = () => {
    'use strict';  
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
               .register('sw.js')
               .then((reg) => {
                console.log('Service worker registered.', reg);
              });               
    }
}
```

Then, include the `sw.js` file, that implements the cache and URL interception:

```javascript
var cacheName = 'random-climb';
var filesToCache = [
  'index.html',
  ...
];
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      cache.addAll(filesToCache).then(function() {
        console.log('ficheros en cache');
      }).catch(function(e) {
        console.error('fallo al cargar los ficheros', e)
      })
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
```

> WARNING: `cache.addAll` is "one or none" call. That means that if one of the URLs fails, none will be added to the caché. So take it into account if you remove or rename files.

### Sound in HTML5

It is very easy to have sound in HTML5. You just need to add a tag like this one:

```html
<audio id="audioplayer">
    <source id="audio_mp3" src="audio/mymp3.mp3" type="audio/mp3">
</audio>
```

Then, when you want to play it, you can simply use the next javascript code:

```javascript
document.getElementById('audioplayer').load();
document.getElementById('audioplayer').play();
```

A difficult part is when you want to play one sound after other. Then you can use the `onended` attribute of `<audio>` to call a custom javascript function that will play the next sound.

In my case, I used a single `<audio>` tag, and implemented a FIFO queue. The sounds are reproduced using the next function (`this.sounds` is the queue where the next reference to the sound is added by calling `this.sounds.push(...)`):

```javascript
RandomizeIt.prototype.nextSound = function () {
    if (this.sounds.length > 0) {
        let s_id = this.sounds.shift();
        let src = this._data[s_id[0]][s_id[1]].sound || null;
        if (sound && (src !== null)) {
            let audioplayer = $('#audioplayer')[0];
            $('#audio_mp3').attr('src', src);
            audioplayer.load()
            audioplayer.play();
        } else
            this.nextSound();
    }
}
```

> WARNING: you need to call `load` before playing the sound; otherwise, the sound is not updated, even if the URL is correct.

### Cookies in Javascript

To set a cookie in javascript, you can simply assign the value of the cookie to `document.cookie`, setting the value and expiration date.

To retrieve the value of the cookies, you can check that var (`document.cookie`), but you need to parse its content, because that var contains every cookie in the page.