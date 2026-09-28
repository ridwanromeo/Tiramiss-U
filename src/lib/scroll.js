// Shared scroll singleton: Lenis instance + reduced-motion flag.
// main.jsx initialises these before React renders.

export const scrollStore = {
  lenis: null,
  reducedMotion: false,
  ready: false,
};

export function scrollToTarget(target) {
  const lenis = scrollStore.lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: -84, duration: 1.4 });
    return;
  }
  if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function lockScroll(lock) {
  const lenis = scrollStore.lenis;
  document.documentElement.classList.toggle('is-locked', lock);
  if (!lenis) return;
  if (lock) lenis.stop();
  else lenis.start();
}
