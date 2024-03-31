import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
      // if ('geolocation' in navigator) {
      //   const options = {
      //     enableHighAccuracy: false,
      //     timeout: 5000,
      //     maximumAge: 0,
      //   };
      //   navigator.geolocation.watchPosition(
      //     (position) => {
      //       const pos = {
      //         accuracy: position.coords.accuracy,
      //         altitude: position.coords.altitude || null,
      //         altitudeAccuracy: position.coords.altitudeAccuracy || null,
      //         heading: position.coords.heading || null,
      //         latitude: position.coords.latitude || 57.880276,
      //         longitude: position.coords.longitude || 59.9628594,
      //         speed: position.coords.speed || null,
      //       };
      //       console.log(pos);
      //     },
      //     (error) => {
      //       console.log('Error position:');
      //       console.log(error);
      //     },
      //     options
      //   );
      // }
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated() {
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
