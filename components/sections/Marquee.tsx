import { Icon } from "../Icon";

export function Marquee({ data }: { data: { id: string; items: string[] } }) {
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {data.items.map((t) => (
        <li key={t}><Icon name="plus" size={14} />{t}</li>
      ))}
    </ul>
  );
  return (
    <section id={data.id} className="marquee" aria-label="Capacidades">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
