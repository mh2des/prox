import { Inter } from 'next/font/google';
import '@uploadthing/react/styles.css';
import '../globals.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary' });

export const metadata = {
  title: 'ProEx | Premium Consulting & Business Development',
  description: 'ProEx offers integrated global expertise and hands-on business experience. Partnering with you for strategy, transformation, marketing, and more.',
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

  return (
    <html lang={locale} dir={dir}>
      <body className={inter.variable}>
        <Header locale={locale} nav={nav} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
