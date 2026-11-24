import { Reveal } from "../motion/Reveal";
import { Icon } from "../Icon";

export type FaqData = { id: string; title: string; items: { q: string; a: string }[] };

export function Faq({ data }: { data: FaqData }) {
  return (
    <section id={data.id} className="section" aria-labelledby={`${data.id}-t`}>
      <div className="wrap faq">
        <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
        <div className="faq__list">
          {data.items.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="faq__item">
                <summary>
                  <span>{f.q}</span>
                  <Icon name="plus" size={22} className="faq__icon" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
