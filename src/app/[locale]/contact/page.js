import { getTranslations } from '../../../lib/i18n';
import { getOffices } from '../../../lib/content';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export default async function Contact({ params: { locale } }) {
  const t = getTranslations(locale);
  const dbOffices = await getOffices(locale);

  // Adapt DB offices to the shape the client expects (name + address lines).
  const offices = dbOffices.map((o) => ({
    name: o.city,
    lines: (o.address || '').split('\n').map((s) => s.trim()).filter(Boolean),
    mapLink: o.mapsUrl,
  }));

  return <ContactClient locale={locale} offices={offices} labels={t.contact} />;
}
