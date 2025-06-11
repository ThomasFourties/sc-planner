import Lenis from 'lenis';

export default defineNuxtPlugin(() => {
  if (process.client) {
    if (typeof Lenis === 'undefined') {
      console.error('Lenis is not defined');
      return;
    }

    new Lenis({
      autoRaf: true,
    });
  }
});
