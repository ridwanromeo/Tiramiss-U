import { Component, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PRELOAD_IMAGES } from '../data/content.js';
import { usePreload, usePrefersReducedMotion } from '../hooks.js';
import { scrollStore } from '../lib/scroll.js';

/* ---------------------------------- Loader --------------------------------- */

export function Loader({ onDone }) {
  const root = useRef(null);
  const { progress, done } = usePreload(PRELOAD_IMAGES);
  const reduced = usePrefersReducedMotion();
  const [minTime, setMinTime] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMinTime(true), reduced ? 300 : 1700);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (!done || !minTime || finished.current) return;
    finished.current = true;
    if (reduced || !root.current) {
      onDone();
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      tl.to('.loader-layer', {
        yPercent: -120,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        stagger: 0.07,
      })
        .to('.loader-meta', { autoAlpha: 0, y: -18, duration: 0.35, ease: 'power2.in' }, 0)
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'expo.inOut',
        }, '-=0.15');
    }, root);
    return () => ctx.revert();
  }, [done, minTime, reduced, onDone]);

  const pct = Math.round(progress * 100);

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading Tiramiss U">
      <div className="loader-stack" aria-hidden="true">
        <span className="loader-layer layer-cocoa" />
        <span className="loader-layer layer-cream" />
        <span className="loader-layer layer-sponge" />
        <span className="loader-dust"><i /><i /><i /><i /><i /><i /></span>
      </div>
      <div className="loader-meta">
        <p className="loader-word">Tiramiss&nbsp;U</p>
        <p className="loader-sub">layering your tasting</p>
        <p className="loader-pct">{pct}%</p>
      </div>
    </div>
  );
}

/* ------------------------------- SmartImage -------------------------------- */

export function SmartImage({
  src,
  alt,
  className = '',
  eager = false,
  fetchPriority,
  onLoad,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src, attempt]);

  return (
    <span className={`smart-img ${loaded ? 'is-loaded' : ''} ${failed ? 'is-failed' : ''} ${className}`}>
      {!loaded && !failed && <span className="smart-shimmer" aria-hidden="true" />}
      {!failed ? (
        <img
          key={attempt}
          src={attempt > 0 ? `${src}?retry=${attempt}` : src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={fetchPriority}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="smart-fallback" role="img" aria-label={`Photo unavailable: ${alt}`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <ellipse cx="60" cy="66" rx="44" ry="30" className="plate" />
            <ellipse cx="60" cy="62" rx="30" ry="20" className="plate-inner" />
            <path d="M45 52c2-6 8-9 15-9s13 3 15 9" className="crumb" />
            <circle cx="52" cy="58" r="2.4" className="crumb" />
            <circle cx="68" cy="60" r="2" className="crumb" />
          </svg>
          <span className="smart-fallback-title">This plate came back empty</span>
          <button
            type="button"
            className="smart-retry"
            onClick={() => {
              setAttempt((a) => a + 1);
            }}
          >
            Bring a fresh one
          </button>
        </span>
      )}
    </span>
  );
}

/* ------------------------------ ErrorBoundary ------------------------------ */

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { broken: false };
  }

  static getDerivedStateFromError() {
    return { broken: true };
  }

  render() {
    if (!this.state.broken) return this.props.children;
    return (
      <div className="error-fallback" role="alert">
        <div className="error-card">
          <svg viewBox="0 0 120 96" className="error-art" aria-hidden="true">
            <path d="M20 78c8-4 6-14 14-16s8 8 16 8 8-10 16-8 10 10 20 8 12-8 14 2v14H20V78z" className="spill" />
            <ellipse cx="60" cy="70" rx="34" ry="8" className="error-plate" />
          </svg>
          <h2>Something spilled in the kitchen</h2>
          <p>The page tripped over a cocoa tin. Your craving is safe though.</p>
          <div className="error-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Start fresh
            </button>
            <a className="btn btn-ghost" href="#top">Back to top</a>
          </div>
        </div>
      </div>
    );
  }
}

/* --------------------------------- NotFound --------------------------------- */

export function NotFound({ hash, onHome }) {
  const root = useRef(null);
  const reduced = scrollStore.reducedMotion;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('.nf-card', { y: 60, autoAlpha: 0, duration: 0.8, ease: 'expo.out' });
      gsap.to('.nf-plate', {
        rotation: 8,
        duration: 1.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="notfound" role="alert">
      <div className="nf-card">
        <svg viewBox="0 0 160 120" className="nf-plate" aria-hidden="true">
          <ellipse cx="80" cy="70" rx="62" ry="38" className="nf-dish" />
          <ellipse cx="80" cy="64" rx="42" ry="26" className="nf-dish-inner" />
          <text x="80" y="78" textAnchor="middle" className="nf-glyph">?</text>
        </svg>
        <p className="nf-kicker">404, extra bitter</p>
        <h2>This slice went missing</h2>
        <p>
          There is nothing baked at <code>{hash || '#unknown'}</code>. The good
          stuff is one click away.
        </p>
        <div className="error-actions">
          <button type="button" className="btn btn-primary" onClick={onHome}>
            Back to sweetness
          </button>
          <a className="btn btn-ghost" href="#flavours" onClick={onHome}>
            See flavours
          </a>
        </div>
      </div>
    </div>
  );
}
