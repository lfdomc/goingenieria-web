"use client";
import { useState, type FormEvent } from "react";
import { site, waLink } from "@/lib/site";
import { Reveal } from "../motion/Reveal";
import { Icon, WhatsAppGlyph } from "../Icon";

export type ContactData = {
  id: string;
  title: string;
  text: string;
  form: { name: string; phone: string; type: string; types: string[]; area: string; message: string; submit: string; waIntro: string };
};

/** Sitio estático en Cloudflare: el formulario arma el mensaje y abre WhatsApp, sin backend. */
export function Contact({ data }: { data: ContactData }) {
  const f = data.form;
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    if (!name) { setError("Escriba su nombre para continuar."); return; }
    setError("");
    const lines = [
      f.waIntro,
      `${f.name}: ${name}`,
      fd.get("phone") && `${f.phone}: ${fd.get("phone")}`,
      `${f.type}: ${fd.get("type")}`,
      fd.get("area") && `${f.area}: ${fd.get("area")}`,
      fd.get("message") && `${f.message} ${fd.get("message")}`,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  };

  return (
    <section id={data.id} className="section contact" aria-labelledby={`${data.id}-t`}>
      <div className="wrap contact__grid">
        <div>
          <Reveal><h2 id={`${data.id}-t`} className="h2 h2--xl">{data.title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">{data.text}</p></Reveal>
          <Reveal delay={0.2}>
            <ul className="contact__people">
              {site.contact.people.map((p) => (
                <li key={p.email}>
                  <span className="muted">{p.label}</span>
                  <a href={waLink(site.contact.whatsappDefaultMessage, p.whatsapp)} target="_blank" rel="noopener" className="contact__wa">
                    <WhatsAppGlyph size={18} /> {p.phone}
                  </a>
                  <a href={`mailto:${p.email}`}><Icon name="mail" size={16} /> {p.email}</a>
                </li>
              ))}
            </ul>
            <p className="muted contact__addr"><Icon name="pin" size={16} /> {site.contact.address.display}</p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="form__row">
              <label htmlFor="f-name">{f.name}</label>
              <input id="f-name" name="name" autoComplete="name" required />
            </div>
            <div className="form__row">
              <label htmlFor="f-phone">{f.phone}</label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
            </div>
            <div className="form__2">
              <div className="form__row">
                <label htmlFor="f-type">{f.type}</label>
                <select id="f-type" name="type" defaultValue={f.types[0]}>
                  {f.types.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form__row">
                <label htmlFor="f-area">{f.area}</label>
                <input id="f-area" name="area" inputMode="numeric" />
              </div>
            </div>
            <div className="form__row">
              <label htmlFor="f-msg">{f.message}</label>
              <textarea id="f-msg" name="message" rows={4} />
            </div>
            {error && <p className="form__error" role="alert">{error}</p>}
            <button type="submit" className="btn btn--accent btn--lg btn--block">
              <WhatsAppGlyph size={20} /> {f.submit}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
