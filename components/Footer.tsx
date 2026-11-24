import { site, waLink, servicesBy } from "@/lib/site";
import { Icon, WhatsAppGlyph } from "./Icon";
import { Reveal } from "./motion/Reveal";

export function Footer() {
  const f = site.footer;
  const social = Object.entries(site.contact.social).filter(([, url]) => url);
  const year = new Date().getFullYear();
  const main = site.contact.people[0];

  return (
    <footer className="footer">
      <div className="footer__line" aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path d="M0 20 H380 L400 6 L420 34 L440 6 L460 34 L480 20 H1200" pathLength={1} className="footer__trace" />
          <path d="M0 20 H380 L400 6 L420 34 L440 6 L460 34 L480 20 H1200" pathLength={100} className="footer__spark" />
        </svg>
      </div>
      <div className="wrap">
        <div className="footer__top">
          <Reveal><p className="footer__closing">{f.closing}</p></Reveal>
          <Reveal delay={0.15}>
            <div className="footer__cta">
              <a className="btn btn--accent btn--lg" href={waLink(f.cta.message)} target="_blank" rel="noopener">
                <WhatsAppGlyph size={20} /> {f.cta.label}
              </a>
              <a className="btn btn--ghost btn--lg" href={`tel:+506${main.phone.replace(/\s/g, "")}`}>
                <Icon name="phone" size={18} /> {main.phone}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <img src={site.brand.logo} alt={site.brand.logoAlt} width={472} height={139} className="footer__logo" loading="lazy" />
            <p className="muted">{site.brand.tagline}.</p>
            <p className="footer__addr muted"><Icon name="pin" size={16} /> {site.contact.address.display}</p>
          </div>

          {f.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="footer__h">{col.title}</h2>
              <ul className="footer__list">
                {servicesBy(col.discipline).map((s) => (
                  <li key={s.slug}><a href={`/servicios/${s.slug}/`}>{s.name}</a></li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="footer__h">Contacto</h2>
            <ul className="footer__contact">
              {site.contact.people.map((p) => (
                <li key={p.email}>
                  <span className="footer__role">{p.label}</span>
                  <a href={waLink(site.contact.whatsappDefaultMessage, p.whatsapp)} target="_blank" rel="noopener"><WhatsAppGlyph size={15} /> {p.phone}</a>
                  <a href={`mailto:${p.email}`}><Icon name="mail" size={15} /> {p.email}</a>
                </li>
              ))}
            </ul>
            {social.length > 0 && (
              <ul className="footer__social">
                {social.map(([k, url]) => (
                  <li key={k}><a href={url} target="_blank" rel="noopener" style={{ textTransform: "capitalize" }}>{k}</a></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {f.copyright}</span>
          <a href={f.credit.url} target="_blank" rel="noopener" className="footer__credit">{f.credit.label}</a>
        </div>
      </div>
    </footer>
  );
}
