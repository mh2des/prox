import ReactDOM from 'react-dom';
import '@uploadthing/react/styles.css';
import '../globals.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export async function generateMetadata({ params: { locale } }) {
  const isAr = locale === 'ar';
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(base),
    title: isAr
      ? 'بروإكس | الاستشارات وتطوير الأعمال'
      : 'ProEx | Premium Consulting & Business Development',
    description: isAr
      ? 'بروإكس تقدّم حلولاً متكاملة في التطوير المؤسسي والحوكمة والتحول الاستراتيجي في مملكة البحرين والمنطقة.'
      : 'ProEx delivers integrated solutions in institutional development, governance, and strategic transformation across Bahrain and the region.',
    alternates: {
      languages: { en: `${base}/en`, ar: `${base}/ar` },
    },
    openGraph: {
      title: isAr ? 'بروإكس للاستشارات وتطوير الأعمال' : 'ProEx | Premium Consulting & Business Development',
      description: isAr ? 'الاستشارات وتطوير الأعمال' : 'Premium Consulting & Business Development',
      type: 'website',
      locale: isAr ? 'ar_BH' : 'en_US',
    },
  };
}

// Next 14 injects a default viewport meta, but it is worth being explicit:
// this is the single tag every responsive rule on the site depends on, and an
// accidental override anywhere would silently ship a 980px-wide phone layout.
// Declared as the separate `viewport` export (NOT inside generateMetadata,
// which Next deprecated for these fields). No maximumScale / userScalable:false
// — pinch-zoom must stay available. viewportFit: 'cover' pairs with the
// safe-area padding on .container in globals.css.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

const navTranslations = {
  en: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    ourWork: 'Our Work',
    media: 'Media / News',
    careers: 'Careers',
    contact: 'Contact',
    langText: 'AR',
    whoWeAre: 'Who We Are',
    ourClients: 'Our Clients',
    leadershipTeam: 'Leadership & Team',
  },
  ar: {
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'خدماتنا',
    ourWork: 'أعمالنا',
    media: 'أخبار وإعلام',
    careers: 'التوظيف',
    contact: 'اتصل بنا',
    langText: 'EN',
    whoWeAre: 'من نحن',
    ourClients: 'عملاؤنا',
    leadershipTeam: 'القيادة والفريق',
  },
};

export default function RootLayout({ children, params: { locale } }) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const nav = navTranslations[locale] ?? navTranslations.en;

  // Preload only the two above-the-fold weights (body = medium/500,
  // headings = bold/700) so the first paint doesn't wait on the font swap.
  // crossOrigin is required even same-origin because fonts fetch in CORS mode.
  //
  // Locale-aware since the faces were split by script: preloading the combined
  // files here would have pulled ~158 KB that unicode-range then declined to
  // use, on top of the subset the page actually needs. An English page now
  // preloads 26 KB of Latin; an Arabic page preloads its own cut and nothing
  // Latin, which the `unicode-range` rules would otherwise fetch a beat later.
  const fontCut = locale === 'ar' ? 'arabic' : 'latin';
  ReactDOM.preload(`/fonts/thmanyah-medium-${fontCut}.woff2`, {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
  ReactDOM.preload(`/fonts/thmanyah-bold-${fontCut}.woff2`, {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return (
    <html lang={locale} dir={dir}>
      <body>
        <Header locale={locale} nav={nav} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
