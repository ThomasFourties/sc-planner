// import gsap from 'gsap';
// import { CustomEase } from 'gsap/CustomEase';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { SplitText } from 'gsap/SplitText';

export default defineNuxtPlugin(() => {
  // if (process.client) {
  //   if (typeof gsap === 'undefined') {
  //     console.error('gsap is not defined');
  //     return;
  //   }

  //   gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

  //   CustomEase.create('comingFast', 'M0,0 C0.25,0 0,1 1,1');
  //   CustomEase.create('leavingFast', 'M0,0 C1,0 0.745,1 1,1');
  // }

  // return {
  //   provide: {
  //     gsap,
  //     ScrollTrigger,
  //     CustomEase,
  //     SplitText,
  //   },
  // };
});
