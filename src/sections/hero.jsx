import { Suspense, lazy, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HERO_CHIPS } from '../data/content.js';
import { useIsFinePointer, usePrefersReducedMotion } from '../hooks.js';
import { scrollToTarget } from '../lib/scroll.js';
import { Magnetic } from '../components/chrome.jsx';
import { SmartImage } from '../components/feedback.jsx';

gsap.registerPlugin(ScrollTrigger);

const CocoaDust = lazy(() => import('./dust.jsx'));

export function Hero({ ready }) {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();
  const fine = useIsFinePointer();

  const go = (href) => (e) => {
    e.preventDefault();
    window.location.hash = href;
    scrollToTarget(href);
  };

  useGSAP(
    () => {
      if (!ready) return;
      if (reduced) {
        gsap.set('.hero-intro', { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero-kicker', { y: 26, autoAlpha: 0, duration: 0.7 }, 0.05)
        .from('.hero-line .rw-mask-inner', { yPercent: 115, duration: 1, stagger: 0.12 }, 0.1)
        .from('.hero-sub', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.55)
        .from('.hero-ctas > *', { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.65)
        .from(
          '.hero-photo',
          { clipPath: 'inset(8% 8% 8% 8% round 40px)', autoAlpha: 0, scale: 0.94, duration: 1.1 },
          0.35,
        )
        .from('.hero-chip', { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 0.8)
        .from('.hero-stamp', { scale: 0, rotation: -40, duration: 0.9, ease: 'back.out(1.6)' }, 0.9);

      gsap.to('.hero-photo-inner', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.utils.toArray('.hero-chip').forEach((chip, i) => {
        gsap.to(chip, {
          yPercent: i % 2 === 0 ? -34 : 26,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      gsap.to('.hero-ghost', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  return (
    <section ref={root} className="hero" id="top" aria-label="Tiramiss U introduction">
      <div className="hero-dust" aria-hidden="true">
        {!reduced && (
          <Suspense fallback={null}>
            <CocoaDust active={ready} />
          </Suspense>
        )}
      </div>
      <span className="hero-ghost" aria-hidden="true">U</span>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker hero-intro">
            <span className="kicker-dot" aria-hidden="true" />
            Sri Petaling, Kuala Lumpur
          </p>
          <h1 className="hero-title">
            <span className="hero-line"><span className="rw-mask"><span className="rw-mask-inner">Dessert</span></span></span>
            <span className="hero-line"><span className="rw-mask"><span className="rw-mask-inner">that <em>misses</em></span></span></span>
            <span className="hero-line"><span className="rw-mask"><span className="rw-mask-inner">you back.</span></span></span>
          </h1>
          <p className="hero-sub hero-intro">
            30+ tiramisu flavours, torched and boxed fresh daily. Pick a slice, stay for the ritual.
          </p>
          <div className="hero-ctas hero-intro">
            <Magnetic>
              <a href="#flavours" className="btn btn-primary" onClick={go('#flavours')} data-cursor="Taste">
                Taste the signatures
                <svg viewBox="0 0 24 24" className="btn-arrow" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </Magnetic>
            <a href="#visit" className="btn btn-ghost" onClick={go('#visit')}>
              Find the cafe
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <figure className="hero-photo" data-cursor="Brulee">
            <span className="hero-photo-inner">
              <SmartImage
                src="/assets/video-torched-brulee-close.jpg"
                alt="Torched creme brulee tiramisu with caramelised sugar crust"
                eager
                fetchPriority="high"
              />
            </span>
            <figcaption>Creme brulee, torched to order</figcaption>
          </figure>
          {HERO_CHIPS.map((chip, i) => (
            <figure className={`hero-chip chip-${i + 1}`} key={chip.label} data-cursor="Yum">
              <img src={chip.img} alt={chip.alt} loading="eager" decoding="async" />
              <figcaption>{chip.label}</figcaption>
            </figure>
          ))}
          <a
            href="#menu"
            onClick={go('#menu')}
            className="hero-stamp"
            aria-label="Browse the full menu"
            data-cursor="Menu"
          >
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text className="stamp-text">
                <textPath href="#stamp-circle">fresh daily, tiramiss u, fresh daily,</textPath>
              </text>
              <path d="M60 74c-8-5.4-13.5-9.7-13.5-14.2 0-3.2 2.5-5.3 5.5-5.3 2.1 0 4 1.2 5 3 1-1.8 2.9-3 5-3 3 0 5.5 2.1 5.5 5.3 0 4.5-5.5 8.8-7.5 14.2z" className="stamp-heart" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
