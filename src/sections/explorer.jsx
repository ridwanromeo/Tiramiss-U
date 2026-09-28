import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FLAVOURS, FLAVOUR_FAMILIES } from '../data/content.js';
import { usePrefersReducedMotion } from '../hooks.js';
import { RevealWords } from '../components/chrome.jsx';
import { SmartImage } from '../components/feedback.jsx';

const EASE = [0.16, 1, 0.3, 1];

function HeartBurst({ burstKey }) {
  return (
    <AnimatePresence>
      {burstKey > 0 && (
        <motion.span
          key={burstKey}
          className="burst"
          aria-hidden="true"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0 }}
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.i
              key={i}
              variants={{
                hidden: { x: 0, y: 0, scale: 0, opacity: 1 },
                show: {
                  x: (i - 2) * 16,
                  y: -18 - (i % 3) * 12,
                  scale: [0, 1, 0.4],
                  opacity: [1, 1, 0],
                  transition: { duration: 0.55, ease: EASE },
                },
              }}
            />
          ))}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function FlavourCard({ flavour, index, liked, onToggle }) {
  const reduced = usePrefersReducedMotion();
  const [burst, setBurst] = useState(0);
  return (
    <motion.article
      className="flav-card"
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, y: 34, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{ duration: 0.55, delay: reduced ? 0 : (index % 4) * 0.06, ease: EASE }}
      data-cursor="Yum"
    >
      <figure className="flav-photo">
        <SmartImage src={flavour.img} alt={flavour.alt} />
        <span className="flav-family">{flavour.family}</span>
      </figure>
      <div className="flav-body">
        <h3>{flavour.name}</h3>
        <p>{flavour.note}</p>
      </div>
      <button
        type="button"
        className={`flav-like ${liked ? 'is-liked' : ''}`}
        aria-pressed={liked}
        aria-label={liked ? `Remove ${flavour.name} from favourites` : `Save ${flavour.name} as favourite`}
        onClick={() => {
          if (!liked) setBurst((b) => b + 1);
          onToggle(flavour.id);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21C6 16.5 2.5 13 2.5 9.3 2.5 6.4 4.8 4.5 7.4 4.5c1.9 0 3.6 1.1 4.6 2.8 1-1.7 2.7-2.8 4.6-2.8 2.6 0 4.9 1.9 4.9 4.8 0 3.7-3.5 7.2-9.5 11.7z" />
        </svg>
        <HeartBurst burstKey={burst} />
      </button>
    </motion.article>
  );
}

export function Explorer() {
  const [family, setFamily] = useState('All');
  const [liked, setLiked] = useState(() => new Set());
  const reduced = usePrefersReducedMotion();
  const list = family === 'All' ? FLAVOURS : FLAVOURS.filter((f) => f.family === family);

  const toggle = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="explorer" id="menu" aria-label="Flavour menu">
      <div className="wrap">
        <div className="explorer-head">
          <div>
            <RevealWords text="One case, eleven cravings." className="section-title" />
            <p className="section-lede">
              A tasting map of the regulars. The case holds 30+, these are the ones people cross town for.
            </p>
          </div>
          <p className="explorer-count" aria-live="polite">
            Showing {list.length} of {FLAVOURS.length}
            {liked.size > 0 && <span className="liked-count">, {liked.size} saved</span>}
          </p>
        </div>
        <div className="filter-row" role="tablist" aria-label="Filter by family">
          {FLAVOUR_FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={family === f}
              className={`chip ${family === f ? 'is-active' : ''}`}
              onClick={() => setFamily(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <motion.div className="flav-grid" layout={!reduced} transition={{ duration: 0.5, ease: EASE }}>
          <AnimatePresence mode="popLayout">
            {list.map((flavour, i) => (
              <FlavourCard
                key={flavour.id}
                flavour={flavour}
                index={i}
                liked={liked.has(flavour.id)}
                onToggle={toggle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
