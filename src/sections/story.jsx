import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SIGNATURES } from '../data/content.js';
import { usePrefersReducedMotion } from '../hooks.js';
import { RevealWords } from '../components/chrome.jsx';
import { SmartImage } from '../components/feedback.jsx';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------- Manifesto ------------------------------- */

const MANIFESTO =
  'One cafe, thirty moods. Every tiramisu is built by hand each morning, torched or chilled to order, and gone before midnight. Nothing waits for tomorrow.';

export function Manifesto() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set('.mani-word', { opacity: 1 });
        gsap.set('.stat-num', { textContent: (i, el) => el.dataset.value });
        return;
      }
      gsap.fromTo(
        '.mani-word',
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: '.mani-text', start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
        },
      );
      gsap.utils.toArray('.stat').forEach((stat) => {
        const num = stat.querySelector('.stat-num');
        const target = Number(num.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
          onUpdate: () => {
            num.textContent = Math.round(obj.v);
          },
        });
      });
      gsap.to('.mani-photo-inner', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="manifesto" aria-label="Why Tiramiss U">
      <div className="mani-grid">
        <div className="mani-copy">
          <RevealWords text="Fresh at noon, gone by night." className="section-title" />
          <p className="mani-text" aria-label={MANIFESTO}>
            {MANIFESTO.split(' ').map((w, i) => (
              <span className="mani-word" key={i} aria-hidden="true">{w} </span>
            ))}
          </p>
          <div className="stats">
            <div className="stat">
              <span className="stat-num" data-value="30">0</span><span className="stat-suffix">+</span>
              <span className="stat-label">flavours in rotation</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-value="100">0</span><span className="stat-suffix">%</span>
              <span className="stat-label">made fresh daily</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-value="0">0</span>
              <span className="stat-label">trays kept overnight</span>
            </div>
          </div>
        </div>
        <figure className="mani-photo" data-cursor="Daily">
          <span className="mani-photo-inner">
            <SmartImage
              src="/assets/video-display-wall.jpg"
              alt="Wall of fresh tiramisu boxes at the Tiramiss U counter"
            />
          </span>
          <figcaption className="hand-note">today's wall, before the rush</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------- Signatures ------------------------------- */

export function Signatures() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        if (reduced) return;
        const track = root.current.querySelector('.sig-track');
        const distance = () => track.scrollWidth - window.innerWidth;
        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              root.current.style.setProperty('--sig-progress', self.progress.toFixed(3));
            },
          },
        });
        gsap.utils.toArray('.sig-photo img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: {
                containerAnimation: pan,
                trigger: img.closest('.sig-card'),
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className={`signatures ${reduced ? 'is-static' : ''}`} id="flavours" aria-label="Signature flavours">
      <div className="sig-pin">
        <div className="sig-track">
          <div className="sig-intro">
            <p className="kicker">The signatures</p>
            <h2 className="section-title">Six slices that built the queue.</h2>
            <p className="section-lede">Keep scrolling. The counter slides past like you are walking it.</p>
            <span className="sig-hint" aria-hidden="true">scroll to walk the counter</span>
          </div>
          {SIGNATURES.map((s) => (
            <article className="sig-card" key={s.id} data-cursor="Taste">
              <figure className="sig-photo">
                <SmartImage src={s.img} alt={s.alt} />
              </figure>
              <div className="sig-body">
                <p className="sig-tag">{s.tag}</p>
                <h3>{s.name}</h3>
                <p>{s.note}</p>
              </div>
            </article>
          ))}
          <div className="sig-outro">
            <p className="sig-outro-big">+24 more waiting in the case</p>
            <a className="btn btn-primary" href="#menu">Browse the menu</a>
          </div>
        </div>
        <div className="sig-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}
