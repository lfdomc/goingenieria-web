import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, waLink, absoluteUrl } from "@/lib/site";
import { serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, WhatsAppGlyph } from "@/components/Icon";
import { ServiceArt } from "@/components/plans/Arts";

export const dynamicParams = false;

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = site.services.find((x) => x.slug === slug);
  if (!s) return {};
  const url = `/servicios/${s.slug}/`;
  const title = `${s.name} en Costa Rica`;
  return {
    title,
    description: `${s.summary} ${s.intro}`.slice(0, 158),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.brand.name}`,
      description: s.summary,
      url: absoluteUrl(url),
      images: [{ url: absoluteUrl(site.seo.ogImage), width: 1200, height: 630, alt: site.brand.name }],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = site.services.find((x) => x.slug === slug);
  if (!s) notFound();
  const related = site.services.filter((x) => x.slug !== s.slug && (x.discipline === s.discipline || s.discipline === "ambas")).slice(0, 3);
  const msg = `Hola Go Ingeniería, quiero cotizar: ${s.name}.`;

  return (
    <>
      <section className="svc">
        <div className="wrap svc__grid">
          <div>
            <nav aria-label="Ruta" className="crumbs">
              <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/#servicios">Servicios</a><span aria-hidden="true">/</span><span aria-current="page">{s.name}</span>
            </nav>
            <Reveal><h1 className="svc__h1">{s.h1}</h1></Reveal>
            <Reveal delay={0.1}><p className="lead">{s.intro}</p></Reveal>
            <Reveal delay={0.2}>
              <div className="hero__ctas">
                <a className="btn btn--accent btn--lg" href={waLink(msg)} target="_blank" rel="noopener"><WhatsAppGlyph size={20} /> Cotizar proyecto</a>
                <a className="btn btn--ghost btn--lg" href="/#proyectos">Ver proyectos</a>
              </div>
            </Reveal>
          </div>
          <figure className="svc__art">
            <div className="svc__art-head">
              <span>{s.name}</span>
              <span className="muted">Go Ingeniería</span>
            </div>
            <ServiceArt art={s.art} />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap svc__body">
          <div className="svc__aside">
            <Reveal><h2 className="h2">Qué incluye</h2></Reveal>
            <Reveal kind="mask" delay={0.1} className="svc__img">
              <img src={s.image} alt={s.imageAlt} loading="lazy" />
            </Reveal>
          </div>
          <ul className="svc__list">
            {s.includes.map((it, i) => (
              <Reveal as="li" key={it} delay={i * 0.06}>
                <Icon name="check" size={22} /> <span>{it}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <h2 className="h2 h2--sm">Servicios relacionados</h2>
            <ul className="related">
              {related.map((r) => (
                <li key={r.slug}>
                  <a href={`/servicios/${r.slug}/`} className="related__card">
                    <span className="related__t">{r.name}</span>
                    <span className="muted">{r.summary}</span>
                    <Icon name="arrow" size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section cta-band">
        <div className="wrap cta-band__inner">
          <h2 className="h2">¿Tiene los planos de su proyecto?</h2>
          <a className="btn btn--accent btn--lg" href={waLink(msg)} target="_blank" rel="noopener"><WhatsAppGlyph size={20} /> Cotizar proyecto</a>
        </div>
      </section>

      <JsonLd data={serviceSchema(s)} />
    </>
  );
}
