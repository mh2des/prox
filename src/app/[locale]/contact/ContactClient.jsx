'use client';

import { useRef, useCallback } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { MapPin } from 'lucide-react';
import styles from './page.module.css';
import { submitContact } from './actions';

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? '…' : label}
    </button>
  );
}

export default function ContactClient({ locale, offices, labels }) {
  const isAr = locale === 'ar';
  const c = labels || {};
  const [state, formAction] = useFormState(submitContact, {});

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const spotRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (imageRef.current) {
      imageRef.current.style.transform = `translate(${x * -18}px, ${y * -12}px) scale(1.06)`;
    }
    if (spotRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      spotRef.current.style.background = `radial-gradient(circle 220px at ${px}% ${py}%, rgba(197,160,89,0.18) 0%, transparent 70%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (imageRef.current) imageRef.current.style.transform = '';
    if (spotRef.current) spotRef.current.style.background = 'transparent';
  }, []);

  const mapLink = offices[0]?.mapLink || null;

  return (
    <div>
      {/* Map + Office Locations */}
      <div
        className={styles.mapSection}
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <a href={mapLink || '#'} target="_blank" rel="noopener noreferrer" className={styles.mapLinkArea}>
          <div className={styles.mapImage} ref={imageRef} />
          <div className={styles.mapOverlay} />
          <div ref={spotRef} className={styles.mapSpotlight} />
          <div className={styles.mapBg}>
            <div className={styles.mapMarker}>
              <MapPin size={28} />
            </div>
          </div>
        </a>
        <div className={`container ${styles.mapInner}`}>
          <div /> {/* Empty spacer for map */}
          <div className={styles.officeTextList}>
            {offices.map((office, i) => (
              <div key={i} className={styles.officeTextItem}>
                <h3 className={styles.officeNameText}>
                  {office.mapLink ? (
                    <a href={office.mapLink} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {office.name}
                    </a>
                  ) : (
                    office.name
                  )}
                </h3>
                {office.lines.map((line, j) => (
                  <p key={j} className={styles.officeLineText}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className={styles.formSection}>
        <div className="container">
          <h2 className={styles.formTitle}>{c.formTitle}</h2>

          {state?.ok ? (
            <p style={{ color: '#52c87a', fontWeight: 600, marginTop: '1rem' }}>
              {isAr ? 'تم إرسال رسالتك بنجاح. شكراً لتواصلك معنا!' : 'Your message has been sent. Thank you for reaching out!'}
            </p>
          ) : (
            <form className={styles.form} action={formAction}>
              {state?.error && (
                <p style={{ color: '#e05b5b', marginBottom: '1rem' }}>{state.error}</p>
              )}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input type="text" name="name" placeholder={c.nameLabel} className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                  <input type="email" name="email" placeholder={isAr ? 'البريد الإلكتروني للعمل' : 'Business Email'} className={styles.input} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input type="text" name="company" placeholder={c.companyLabel} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <input type="text" name="title" placeholder={isAr ? 'المسمى الوظيفي' : 'Title'} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <input type="text" name="subject" placeholder={isAr ? 'الموضوع' : 'Subject'} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <textarea name="message" rows="5" placeholder={c.messageLabel} className={styles.input} required></textarea>
              </div>

              <div className={styles.submitRow}>
                <SubmitButton label={isAr ? 'إرسال' : 'Send'} />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
