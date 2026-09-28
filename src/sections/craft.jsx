import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { CRAFT_STEPS } from '../data/content.js';
import { useIsFinePointer, usePrefersReducedMotion } from '../hooks.js';
import { Magnetic, RevealWords } from '../components/chrome.jsx';
import { SmartImage } from '../components/feedback.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------ Craft (dark) ------------------------------- */

export function Craft() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        if (reduced) return;
        const slides = gsap.utils.toArray('.craft-slide');
        const dots = gsap.utils.toArray('.craft-dot');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=2600',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
              dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
              root.current.style.setProperty('--craft-progress', self.progress.toFixed(3));
            },
          },
        });
        slides.forEach((slide, i) => {
          if (i === 0) {
            tl.from(slide.querySelectorAll('.craft-anim'), { y: 46, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0);
          } else {
            tl.to(slides[i - 1], { autoAlpha: 0, y: -60, duration: 0.5, ease: 'power2.in' });
            tl.fromTo(
              slide,
              { autoAlpha: 0, y: 80 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            );
            tl.from(slide.querySelector('.craft-photo'), { scale: 1.12, duration: 0.8, ease: 'none' }, '<');
          }
        });
        tl.to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className={`craft ${reduced ? 'is-static' : ''}`} id="craft" aria-label="How it is made">
      <div className="craft-stage">
        <div className="craft-slides">
          {CRAFT_STEPS.map((step, i) => (
            <div className={`craft-slide ${i === 0 ? 'is-first' : ''}`} key={step.id}>
              <div className="craft-copy">
                <p className="kicker light">The night kitchen</p>
                <h2 className="section-title light craft-anim">{step.title}</h2>
                <p className="section-lede light craft-anim">{step.body}</p>
                <p className="craft-step-no craft-anim" aria-hidden="true">
                  {i + 1} / {CRAFT_STEPS.length}
                </p>
              </div>
              <figure className="craft-photo craft-anim" data-cursor="Fresh">
                <SmartImage src={step.img} alt={step.alt} />
              </figure>
            </div>
          ))}
        </div>
        <div className="craft-progress" aria-hidden="true">
          <div className="craft-dots">
            {CRAFT_STEPS.map((s) => (
              <span className="craft-dot" key={s.id} />
            ))}
          </div>
          <span className="craft-bar"><span /></span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Packaging -------------------------------- */

function TiltCard({ children, className = '' }) {
  const fine = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 });

  if (!fine || reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

const PERKS = [
  { title: 'Four-slice gift box', body: 'Mix any flavours in the case. The box keeps them cold and camera ready.' },
  { title: 'Ribbon tied by hand', body: 'Navy ribbon, logo sleeve, thank-you note. Ready to hand over as is.' },
  { title: 'Dine in or take home', body: 'Eat it at the marble counter or save it for later. Both are correct.' },
];

export function Packaging() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray('.pack-badge').forEach((badge, i) => {
        gsap.to(badge, {
          yPercent: (i + 1) * (i % 2 === 0 ? -26 : 20),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      gsap.from('.pack-perk', {
        x: 44,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.pack-perks', start: 'top 78%', once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="packaging" id="gifting" aria-label="Gift boxes">
      <div className="wrap pack-grid">
        <div className="pack-visual">
          <TiltCard className="pack-card" >
            <figure data-cursor="Gift">
              <SmartImage src="/assets/pack-gift-box-ribbon.jpg" alt="Tiramiss U gift box with navy ribbon, four slices inside" />
              <figcaption>boxed, ribboned, ready to gift</figcaption>
            </figure>
          </TiltCard>
          <figure className="pack-card-small" data-cursor="Yum">
            <SmartImage src="/assets/dish-box-four-colours.jpg" alt="Open box with four colourful tiramisu slices" />
          </figure>
          <span className="pack-badge badge-1" aria-hidden="true">ribbon wrapped</span>
          <span className="pack-badge badge-2" aria-hidden="true">4 slice box</span>
          <span className="pack-badge badge-3" aria-hidden="true">take home</span>
        </div>
        <div className="pack-copy">
          <RevealWords text="Built for the hand-off." className="section-title" />
          <p className="section-lede">
            Tiramisu travels well when it is boxed right. Ours arrives looking like the counter.
          </p>
          <ul className="pack-perks">
            {PERKS.map((p) => (
              <li className="pack-perk" key={p.title}>
                <span className="perk-heart" aria-hidden="true" />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Magnetic>
            <a href="#visit" className="btn btn-primary" data-cursor="Go">
              Plan a pickup
              <svg viewBox="0 0 24 24" className="btn-arrow" aria-hidden="true"><path d="M4 12h15m-6-7 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
