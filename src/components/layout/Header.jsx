"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header({ locale, nav }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen((open) => !open);

  const toggleAboutDropdown = (e) => {
    e.preventDefault();
    setIsAboutDropdownOpen((open) => !open);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAboutDropdownOpen(false);
      }
      // The mobile panel is absolutely positioned inside the header, so
      // "outside the header" is the correct dismiss region for it too.
      // Without this, tapping the page behind an open panel did nothing and
      // the menu stayed draped over the content.
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAboutDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // touchstart dismisses on the first contact rather than waiting for the
    // synthesised mouse event, which iOS delays or swallows on scroll.
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close both menus on every route change. The individual <Link>s already did
  // this in their own onClick, but the logo link, the language switcher and the
  // browser's back/forward buttons did not — the open panel stayed on screen,
  // covering the top of the page the user had just navigated to.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAboutDropdownOpen(false);
  }, [pathname]);

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    setIsMobileMenuOpen(false);
    setIsAboutDropdownOpen(false);
    router.push(segments.join('/'));
  };

  // Helper: check if a link is active
  const isActive = (href) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  const isArabic = locale === 'ar';

  const links = [
    { href: `/${locale}`,          label: nav.home },
    {
      href: `/${locale}/about`,
      label: nav.about,
      dropdown: [
        { href: `/${locale}/who-we-are`, label: nav.whoWeAre },
        { href: `/${locale}/leadership-team`, label: nav.leadershipTeam },
        { href: `/${locale}/our-clients`, label: nav.ourClients },
      ]
    },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/our-work`,  label: nav.ourWork },
    { href: `/${locale}/media`,    label: nav.media },
    { href: `/${locale}/careers`,  label: nav.careers },
    { href: `/${locale}/contact`,  label: nav.contact },
  ];

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={`container ${styles.headerContainer}`}>
        {/* Logo */}
        <Link href={`/${locale}`} className={styles.logo}>
          {/* 126x100 matches the asset's real 600x477 aspect ratio. The old
              80x80 told the browser the mark was square, so before the image
              decoded it reserved a 55x55 box that then jumped to 55x69. */}
          <Image src="/logo.png" alt="ProEx Logo" width={126} height={100} className={styles.logoImg} priority />
        </Link>

        {/* Desktop Nav */}
        <nav
          id="primary-nav"
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
          className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}
        >
          <ul className={styles.navList}>
            {links.map((link) => (
              // `styles.dropdownActive` used to be appended here, but no such
              // class exists in the module — it resolved to undefined and put a
              // literal class="… undefined" on the <li> whenever the menu opened.
              <li
                key={link.href}
                className={link.dropdown ? styles.hasDropdown : undefined}
                ref={link.dropdown ? dropdownRef : null}
              >
                {link.dropdown ? (
                  <div className={styles.dropdownWrapper}>
                    {/* A real <button>, not a <div>: as a div this control was
                        unreachable by keyboard and announced nothing about its
                        expanded state. The click handler already made it work
                        on touch, so behaviour is unchanged for pointer users. */}
                    <button
                      type="button"
                      className={`${styles.dropdownTrigger} ${isAboutDropdownOpen ? styles.open : ''}`}
                      onClick={toggleAboutDropdown}
                      aria-expanded={isAboutDropdownOpen}
                      aria-controls="nav-about-submenu"
                    >
                      <span className={isActive(link.href) ? styles.activeLink : ''}>
                        {link.label}
                      </span>
                      <span className={styles.dropdownArrow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </button>
                    <ul
                      id="nav-about-submenu"
                      className={`${styles.dropdownMenu} ${isAboutDropdownOpen ? styles.dropdownVisible : ''}`}
                    >
                      {link.dropdown.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={isActive(sub.href) ? styles.subActive : undefined}
                            aria-current={isActive(sub.href) ? 'page' : undefined}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsAboutDropdownOpen(false);
                            }}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={isActive(link.href) ? styles.activeLink : ''}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Language switcher */}
            <li>
              <button className={styles.langBtn} type="button" aria-label={isArabic ? 'تغيير اللغة' : 'Switch Language'} onClick={switchLanguage}>
                {nav.langText}
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={styles.mobileMenuBtn}
          type="button"
          onClick={toggleMenu}
          aria-label={isArabic ? 'تبديل القائمة' : 'Toggle menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-nav"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
