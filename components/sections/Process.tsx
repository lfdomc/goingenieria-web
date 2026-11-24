import { Reveal } from "../motion/Reveal";

export type ProcessData = {
  id: string;
  title: string;
  intro: string;
  steps: { title: string; text: string; image: string; imageAlt: string }[];
};

export function Process({ data }: { data: ProcessData }) {
  return (
    <section id={data.id} className="section process" aria-labelledby={`${data.id}-t`}>
      <div className="wrap process__grid">
        <div className="process__aside">
          <Reveal><h2 id={`${data.id}-t`} className="h2">{data.title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{data.intro}</p></Reveal>
        </div>
        <ol className="stack">
          {data.steps.map((s, i) => (
            <li key={s.title} className="stack__item" style={{ top: `calc(6.5rem + ${i * 18}px)`, zIndex: i + 1 }}>
              <article className="stack__card">
                <div className="stack__text">
                  <span className="stack__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="stack__t">{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </div>
                <img src={s.image} alt={s.imageAlt} loading="lazy" className="stack__img" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
