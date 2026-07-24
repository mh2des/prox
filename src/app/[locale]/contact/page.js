import { getTranslations } from '../../../lib/i18n';
import { getOffices, getPage } from '../../../lib/content';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export default async function Contact({ params: { locale } }) {
  const t = getTranslations(locale);
  const [dbOffices, page] = await Promise.all([
    getOffices(locale),
    getPage('contact', locale),
  ]);

  // Adapt DB offices to the shape the client expects (name + address lines),
  // now also passing phone & email through so they can be rendered.
  const offices = dbOffices.map((o) => ({
    name: o.city,
    lines: (o.address || '').split('\n').map((s) => s.trim()).filter(Boolean),
    mapLink: o.mapsUrl,
    phone: o.phone || null,
    email: o.email || null,
  }));

  return (
    <ContactClient
      locale={locale}
      offices={offices}
      labels={t.contact}
      page={page || null}
    />
  );
}
