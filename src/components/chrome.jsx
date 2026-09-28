import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { NAV_LINKS } from '../data/content.js';
import { useIsFinePointer, usePrefersReducedMotion } from '../hooks.js';
import { scrollStore, scrollToTarget, lockScroll } from '../lib/scroll.js';

/* ------------------------------ Custom cursor ------------------------------ */

export function Cursor() {
  const fine = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const [label, setLabel] = useState(null);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!fine || reduced) return;
    document.body.classList.add('has-cursor');
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const t = e.target?.closest?.('[data-cursor]');
      setLabel(t ? t.getAttribute('data-cursor') : null);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <>
      <motion.span
        className={`cursor-dot ${pressed ? 'is-pressed' : ''}`}
        style={{ x, y }}
        aria-hidden="true"
      />
      <motion.span
        className={`cursor-ring ${label ? 'is-label' : ''} ${pressed ? 'is-pressed' : ''}`}
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        <AnimatePresence>
          {label && (
            <motion.em
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {label}
            </motion.em>
          )}
        </AnimatePresence>
      </motion.span>
    </>
  );
}

/* -------------------------------- Magnetic --------------------------------- */

export function Magnetic({ children, strength = 0.32, className = '' }) {
  const fine = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  if (!fine || reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={`magnetic ${className}`}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ---------------------------------- Nav ------------------------------------ */

export function Nav({ ready }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const lenis = scrollStore.lenis;
    if (lenis) {
      const onScroll = (e) => {
        const y = typeof e?.scroll === 'number' ? e.scroll : window.scrollY;
        setScrolled(y > 40);
        if (!open) setHidden(y > 420 && y > lastY.current + 4);
        else setHidden(false);
        lastY.current = y;
      };
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }
    // Reduced-motion path (no Lenis): observe the hero instead of scroll events.
    const hero = document.getElementById('top');
    if (!hero) return undefined;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: '-40px 0px 0px 0px',
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [open ]);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open ]);

  const go = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    window.location.hash = href;
    scrollToTarget(href === '#top' ? 0 : href);
  };

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        <a href="#top" className="brand" onClick={go('#top')} data-cursor="Hello" aria-label="Tiramiss U home">
          <span className="brand-badge">
            <img src="/assets/brand-logo.jpg" alt="Tiramiss U logo" width="44" height="44" />
          </span>
          <span className="brand-word">Tiramiss&nbsp;U</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={go(l.href)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <Magnetic>
            <a href="#gifting" className="btn btn-primary btn-sm" onClick={go('#gifting')} data-cursor="Yum">
              Order a box
            </a>
          </Magnetic>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ clipPath: 'circle(140% at 92% 6%)' }}
            exit={{ clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Menu">
              {[{ label: 'Top', href: '#top' }, ...NAV_LINKS].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={go(l.href)}
                  initial={{ y: 44, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="menu-word">{l.label}</span>
                </motion.a>
              ))}
            </nav>
            <p className="menu-foot">Sri Petaling, KL. Daily 12pm to 10pm.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------------------- Marquee ---------------------------------- */

const MARQUEE_ITEMS = [
  '30+ flavours',
  'made fresh daily',
  'never kept overnight',
  'torched brulee',
  'Sri Petaling KL',
];

export function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div className="marquee-half" key={half} aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span className="marquee-item" key={`${half}-${i}`}>
                {item}
                <svg viewBox="0 0 24 24" className="marquee-heart" aria-hidden="true">
                  <path d="M12 21C6 16.5 2.5 13 2.5 9.3 2.5 6.4 4.8 4.5 7.4 4.5c1.9 0 3.6 1.1 4.6 2.8 1-1.7 2.7-2.8 4.6-2.8 2.6 0 4.9 1.9 4.9 4.8 0 3.7-3.5 7.2-9.5 11.7z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Reveal ---------------------------------- */

export function RevealWords({ text, className = '', as: Tag = 'h2', delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(' ');
  return (
    <Tag className={`reveal-words ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span className="rw-mask" key={i} aria-hidden="true">
          <motion.span
            className="rw-word"
            initial={reduced ? false : { yPercent: 110, rotate: 4 }}
            whileInView={{ yPercent: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: delay + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function RevealWipe({ children, className = '', delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={`reveal-wipe ${className}`}
      initial={reduced ? false : { clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
