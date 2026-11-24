import { site, absoluteUrl, type Service } from "./site";

const orgId = absoluteUrl("/#organizacion");

export function organizationSchema() {
  const c = site.contact;
  const sameAs = Object.values(c.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": orgId,
    name: site.brand.name,
    legalName: site.brand.legalName,
    description: site.seo.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/logo-go-ingenieria.png"),
    image: absoluteUrl(site.seo.ogImage),
    foundingDate: String(site.brand.foundingYear),
    email: c.people[0].email,
    telephone: `+506 ${c.people[0].phone}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: `${c.address.street}, ${c.address.locality}`,
      addressRegion: c.address.region,
      addressCountry: c.address.country,
    },
    areaServed: { "@type": "Country", name: c.areaServed },
    contactPoint: c.people.map((p) => ({
      "@type": "ContactPoint",
      telephone: `+506 ${p.phone}`,
      email: p.email,
      contactType: p.label,
      availableLanguage: ["es"],
    })),
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de ingeniería eléctrica y mecánica",
      itemListElement: site.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(`/servicios/${s.slug}/`) },
      })),
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(s: Service) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.h1,
      serviceType: s.name,
      description: s.intro,
      url: absoluteUrl(`/servicios/${s.slug}/`),
      image: absoluteUrl(s.image),
      areaServed: { "@type": "Country", name: site.contact.areaServed },
      provider: { "@id": orgId },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Servicios", item: absoluteUrl("/#servicios") },
        { "@type": "ListItem", position: 3, name: s.name, item: absoluteUrl(`/servicios/${s.slug}/`) },
      ],
    },
  ];
}
