import { site } from "@/lib/site";
import { SectionRenderer } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

export default function Home() {
  const faq = site.sections.find((s) => s.type === "faq") as { items?: { q: string; a: string }[] } | undefined;
  return (
    <>
      <SectionRenderer sections={site.sections} />
      {faq?.items && <JsonLd data={faqSchema(faq.items)} />}
    </>
  );
}
