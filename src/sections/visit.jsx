import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { NAV_LINKS } from '../data/content.js';
import { usePrefersReducedMotion } from '../hooks.js';
import { scrollToTarget } from '../lib/scroll.js';
import { Magnetic, RevealWords, RevealWipe } from '../components/chrome.jsx';
import { SmartImage } from '../components/feedback.jsx';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------- Tea time ------------------------------- */

export function TeaTime() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('.ticket', {
        y: 70,
        autoAlpha: 0,
        rotate: -2,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
      });
      gsap.from('.ticket-stamp', {
        scale: 2.2,
        autoAlpha: 0,
        rotate: -18,
        duration: 0.6,
        ease: 'power4.in',
        scrollTrigger: { trigger: '.ticket', start: 'top 55%', once: true },
      });
      gsap.to('.ticket-photo-inner', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="teatime" id="teatime" aria-label="Tea time set">
      <div className="wrap">
        <RevealWords text="Slow afternoons, set price." className="section-title center" />
        <div className="ticket" data-cursor="RM19.90">
          <figure className="ticket-photo">
            <span className="ticket-photo-inner">
              <SmartImage src="/assets/promo-tea-time-full.jpg" alt="Tea time set with four tiramisu slices, latte and iced americano" />
            </span>
          </figure>
          <div className="ticket-perf" aria-hidden="true" />
          <div className="ticket-body">
            <p className="kicker">Tea time set</p>
            <p className="ticket-price">RM19.90</p>
            <p className="ticket-desc">
              One RM18 tiramisu plus a latte or americano. Craving another flavour, just top up the difference.
            </p>
            <ul className="ticket-facts">
              <li>Weekdays, 12pm to 6pm</li>
              <li>Dine in at Sri Petaling</li>
            </ul>
            <Magnetic>
              <a href="#visit" className="btn btn-dark" data-cursor="Go">Find the cafe</a>
            </Magnetic>
          </div>
          <span className="ticket-stamp" aria-hidden="true">weekdays<br />12 to 6</span>
        </div>
        <RevealWipe className="ticket-band-wrap" delay={0.1}>
          <figure className="ticket-band" data-cursor="Plates">
            <SmartImage src="/assets/dish-tea-time-plates.jpg" alt="Four tiramisu plates with latte and iced americano on the counter" />
            <figcaption className="hand-note">the 12pm lineup, plated and poured</figcaption>
          </figure>
        </RevealWipe>
      </div>
    </section>
  );
}

/* --------------------------------- Drinks --------------------------------- */

export function Drinks() {
  const root = useRef(null);
  const videoRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('.reel-frame', {
        clipPath: 'inset(12% 10% 12% 10% round 48px)',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.reel-frame', start: 'top 82%', once: true },
      });
      gsap.utils.toArray('.drink-float').forEach((el, i) => {
        gsap.to(el, {
          yPercent: i === 0 ? -22 : 18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section ref={root} className="drinks" id="drinks" aria-label="Tiramisu drinks and cafe reel">
      <div className="wrap drinks-grid">
        <div className="drinks-copy">
          <RevealWords text="Sippable tiramisu." className="section-title" />
          <p className="section-lede">
            The case inspired the bar. Matcha clouds, roasted coffee, ladyfinger crumbs on top.
          </p>
          <div className="drink-stills">
            <figure className="drink-float" data-cursor="Matcha">
              <SmartImage src="/assets/video-drinks-duo.jpg" alt="Matcha tiramisu drink beside a coffee tiramisu cup" />
            </figure>
            <figure className="drink-float" data-cursor="Coffee">
              <SmartImage src="/assets/video-coffee-cup-hand.jpg" alt="Hand holding a tiramisu coffee topped with cocoa" />
            </figure>
          </div>
        </div>
        <div className="reel">
          <RevealWipe>
            <figure className="reel-frame" data-cursor={playing ? 'Pause' : 'Play'}>
              {!videoFailed ? (
                <video
                  ref={videoRef}
                  src="/media/cafe-reel.mp4"
                  poster="/assets/video-table-flatlay.jpg"
                  muted={muted}
                  loop
                  playsInline
                  preload="none"
                  onError={() => setVideoFailed(true)}
                  aria-label="Inside the Tiramiss U cafe: fresh tiramisu trays and the team at work"
                />
              ) : (
                <span className="reel-fallback" role="img" aria-label="Cafe reel unavailable">
                  <SmartImage src="/assets/video-table-flatlay.jpg" alt="Desserts and drinks on the cafe table" />
                  <span className="reel-fallback-note">The reel is resting. The case is not.</span>
                </span>
              )}
              <button type="button" className="reel-toggle" onClick={togglePlay} aria-label={playing ? 'Pause reel' : 'Play reel'}>
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
                )}
              </button>
              {!videoFailed && (
                <button
                  type="button"
                  className="reel-mute"
                  onClick={() => {
                    setMuted((m) => {
                      if (videoRef.current) videoRef.current.muted = !m;
                      return !m;
                    });
                  }}
                  aria-label={muted ? 'Unmute reel' : 'Mute reel'}
                >
                  {muted ? 'Muted' : 'Sound on'}
                </button>
              )}
            </figure>
          </RevealWipe>
          <p className="hand-note">58 seconds inside the cafe. sound optional.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Visit + footer ----------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ADDRESS = 'Lot 22C, Jalan Radin Bagus 6, Bandar Baru Sri Petaling, 57000 Kuala Lumpur';

function NotifyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [shake, setShake] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!EMAIL_RE.test(email.trim())) {
      setError('That email looks half baked. Check it and try again.');
      setShake((s) => s + 1);
      return;
    }
    setError('');
    setStatus('sending');
    window.setTimeout(() => setStatus('done'), 900);
  };

  if (status === 'done') {
    return (
      <motion.div
        className="form-success"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        role="status"
      >
        <motion.span
          className="form-heart"
          aria-hidden="true"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <h3>You are on the list</h3>
        <p>New flavours land in your inbox before they hit the case.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="notify-form"
      onSubmit={submit}
      noValidate
      key={shake}
      animate={shake > 0 ? { x: [0, -12, 10, -7, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <label className="field">
        <span>Email for flavour drops</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'notify-error' : undefined}
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'} data-cursor="Join">
        {status === 'sending' ? 'Plating...' : 'Notify me'}
      </button>
      {error && (
        <p className="field-error" id="notify-error" role="alert">{error}</p>
      )}
    </motion.form>
  );
}

export function Visit() {
  const root = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('.visit-card', {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.visit-grid', start: 'top 76%', once: true },
      });
      gsap.to('.visit-photo-a', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.to('.visit-photo-b', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = ADDRESS;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section ref={root} className="visit" id="visit" aria-label="Visit the cafe">
      <div className="wrap">
        <RevealWords text="Come hungry, leave boxed." className="section-title center" />
        <div className="visit-grid">
          <div className="visit-card visit-info">
            <figure className="visit-photo-a" data-cursor="Day">
              <SmartImage src="/assets/video-storefront-day.jpg" alt="Tiramiss U storefront in Sri Petaling during the day" />
            </figure>
            <figure className="visit-photo-b" data-cursor="Night">
              <SmartImage src="/assets/video-storefront-night.jpg" alt="Tiramiss U storefront lit up at night" />
            </figure>
            <h3>Find us in Sri Petaling</h3>
            <address>{ADDRESS}</address>
            <p className="visit-hours">Open daily, 12pm to 10pm</p>
            <div className="visit-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={copyAddress} data-cursor="Copy">
                {copied ? 'Copied to clipboard' : 'Copy address'}
              </button>
              <a
                className="btn btn-dark btn-sm"
                href="https://www.google.com/maps/search/?api=1&query=Tiramiss+U+Sri+Petaling"
                target="_blank"
                rel="noreferrer"
                data-cursor="Maps"
              >
                Open maps
              </a>
            </div>
          </div>
          <div className="visit-card visit-notify">
            <h3>New slices sell out by evening.</h3>
            <p className="section-lede">One short email when a new flavour lands. No spam, only cream.</p>
            <NotifyForm />
            <div className="socials">
              <a href="https://www.instagram.com/tiramissu_kl" target="_blank" rel="noreferrer" data-cursor="IG">Instagram</a>
              <a href="https://www.tiktok.com/@tiramissu_kl" target="_blank" rel="noreferrer" data-cursor="TT">TikTok</a>
              <span className="social-handle">@tiramissu_kl</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const toTop = (e) => {
    e.preventDefault();
    window.location.hash = '#top';
    scrollToTarget(0);
  };
  return (
    <footer className="footer">
      <div className="wrap">
        <nav className="footer-links" aria-label="Footer">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <p className="footer-giant" aria-label="Tiramiss U">Tiramiss&nbsp;U</p>
        <div className="footer-meta">
          <p>Sri Petaling, Kuala Lumpur. Daily 12pm to 10pm.</p>
          <Magnetic>
            <button type="button" className="to-top" onClick={toTop} data-cursor="Up" aria-label="Back to top">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5m-7 7 7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </Magnetic>
        </div>
        <p className="footer-small">Photos and reel courtesy of the cafe and its regulars. Made fresh, like everything here.</p>
      </div>
    </footer>
  );
}
