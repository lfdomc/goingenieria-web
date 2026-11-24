import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import { site, absoluteUrl, themeVars } from "@/lib/site";
import { organizationSchema } from "@/lib/schema";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.domain),
  title: { default: site.seo.title, template: site.seo.titleTemplate },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.seo.locale,
    url: absoluteUrl("/"),
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: absoluteUrl(site.seo.ogImage), width: 1200, height: 630, alt: site.brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [absoluteUrl(site.seo.ogImage)],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: site.design.theme.colors[site.design.mode as "dark" | "light"].bg,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = site.design.theme.fonts.googleFontsQuery;
  const ga = site.seo.ga4;
  return (
    <html lang="es-CR" data-mode={site.design.mode} data-motion={site.design.dials.motion <= 3 ? "low" : "on"} style={themeVars() as CSSProperties}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${fonts}&display=swap`} />
        <link rel="preload" as="image" href={site.sections[0]?.type === "hero" ? (site.sections[0] as { image?: string }).image : undefined} />
        {ga && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <a href="#contenido" className="skip">Saltar al contenido</a>
        <MotionProvider intensity={site.design.dials.motion}>
          <Nav />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </MotionProvider>
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
