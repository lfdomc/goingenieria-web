"use client";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { site, waLink } from "@/lib/site";
import { Icon } from "./Icon";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = y > prev && y > 240 && !open;
    if (nextHidden !== hidden) setHidden(nextHidden);
    const nextSolid = y > 24;
    if (nextSolid !== solid) setSolid(nextSolid);
  });

  return (
    <motion.header
      className={`nav ${solid ? "nav--solid" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="wrap nav__inner">
        <a href="/" className="nav__logo" aria-label={`${site.brand.name}, inicio`}>
          <img src={site.brand.logo} alt={site.brand.logoAlt} width={472} height={139} />
        </a>
        <nav aria-label="Principal" className="nav__links">
          {site.nav.links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="btn btn--accent nav__cta" href={waLink(site.nav.cta.message)} target="_blank" rel="noopener">
          {site.nav.cta.label}
        </a>
        <button
          className="nav__burger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movil"
            aria-label="Menú móvil"
            className="nav__mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {site.nav.links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <a className="btn btn--accent" href={waLink(site.nav.cta.message)} target="_blank" rel="noopener">
              {site.nav.cta.label}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
