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
  ReactDOM.preload('/fonts/thmanyah-text-medium.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
  ReactDOM.preload('/fonts/thmanyah-text-bold.woff2', {
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
