import '@fontsource/caprasimo/400.css';
import '@fontsource-variable/outfit';
import '@fontsource/caveat/600.css';

import './styles/tokens.css';
import './styles/app.css';
import './styles/sections.css';

import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import App from './components/App.jsx';
import { scrollStore } from './lib/scroll.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);
gsap.defaults({ ease: 'power3.out' });

scrollStore.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!scrollStore.reducedMotion) {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  scrollStore.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

createRoot(document.getElementById('root')).render(<App />);
