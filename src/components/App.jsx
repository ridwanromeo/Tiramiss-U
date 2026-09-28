import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KNOWN_HASHES } from '../data/content.js';
import { lockScroll, scrollStore, scrollToTarget } from '../lib/scroll.js';
import { Cursor, Marquee, Nav } from './chrome.jsx';
import { ErrorBoundary, Loader, NotFound } from './feedback.jsx';
import { Hero } from '../sections/hero.jsx';
import { Explorer } from '../sections/explorer.jsx';
import { Manifesto, Signatures } from '../sections/story.jsx';
import { Craft, Packaging } from '../sections/craft.jsx';
import { Drinks, Footer, TeaTime, Visit } from '../sections/visit.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(null);
  const ready = !loading && !missing;

  const handleDone = useCallback(() => {
    setLoading(false);
    scrollStore.ready = true;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    lockScroll(loading || missing !== null);
  }, [loading, missing]);

  // Hash routing: known hashes scroll, unknown hashes show the 404 scene.
  useEffect(() => {
    const route = () => {
      const hash = window.location.hash;
      if (!KNOWN_HASHES.has(hash)) {
        setMissing(hash);
        return;
      }
      setMissing(null);
      if (!loading && hash && hash !== '#top') {
        requestAnimationFrame(() => scrollToTarget(hash));
      }
    };
    route();
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, [loading]);

  // Smooth-scroll every in-page anchor through Lenis.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target?.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!KNOWN_HASHES.has(href)) return; // let the router show 404
      e.preventDefault();
      if (window.location.hash === href && href !== '#top') {
        scrollToTarget(href);
        return;
      }
      window.location.hash = href;
      scrollToTarget(href === '#top' ? 0 : href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Recalculate scroll triggers once everything (fonts, images) settles.
  useEffect(() => {
    if (loading) return;
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});
    const t = window.setTimeout(refresh, 2500);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
    };
  }, [loading]);

  const goHome = useCallback(() => {
    window.location.hash = '#top';
    setMissing(null);
    scrollToTarget(0);
  }, []);

  return (
    <ErrorBoundary>
      <Cursor />
      <Nav ready={!loading} />
      {loading && <Loader onDone={handleDone} />}
      {missing !== null && !loading && <NotFound hash={missing} onHome={goHome} />}
      <main className={loading ? 'is-loading' : ''}>
        <Hero ready={!loading} />
        <Marquee />
        <Manifesto />
        <Signatures />
        <Explorer />
        <Craft />
        <Packaging />
        <TeaTime />
        <Drinks />
        <Visit />
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
