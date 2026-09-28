import { useEffect, useState } from 'react';
import { useReducedMotion as useMotionReduced } from 'motion/react';
import { scrollStore } from './lib/scroll.js';

export function usePrefersReducedMotion() {
  const motionReduced = useMotionReduced();
  const [reduced, setReduced] = useState(
    () => motionReduced || scrollStore.reducedMotion,
  );
  useEffect(() => {
    setReduced(motionReduced || scrollStore.reducedMotion);
  }, [motionReduced]);
  return reduced;
}

export function useIsFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}

// Preload a list of image URLs with live progress (0..1).
export function usePreload(urls) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const total = urls.length || 1;
    const tick = () => {
      loaded += 1;
      if (cancelled) return;
      setProgress(loaded / total);
      if (loaded >= total) setDone(true);
    };
    urls.forEach((src) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });
    const fallback = window.setTimeout(() => {
      if (!cancelled) {
        setProgress(1);
        setDone(true);
      }
    }, 9000);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { progress, done };
}
