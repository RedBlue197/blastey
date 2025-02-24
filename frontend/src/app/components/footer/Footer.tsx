// src/app/components/Footer.tsx
"use client"; // Client component directive
import Image from 'next/image';
import styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';  // Import useEffect

export default function Footer() {
  const { t, i18n } = useTranslation(); // Get i18n instance

  useEffect(() => {
    console.log('Language changed to', i18n.language);
  }, [i18n.language, t]);  // Depend on both i18n.language and t

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoAndContact}>
          <div className={styles.contactInfo}>
            <h4>{t('footer.contactUs')}</h4>
            <p>{t('footer.contactEmail')}</p>
          </div>
        </div>
        <div className={styles.quickLinks}>
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><a href="/">{t('footer.home')}</a></li>
            <li><a href="/trips">{t('footer.trips')}</a></li>
            {/* <li><a href="/activities">{t('footer.activities')}</a></li> */}
            {/* <li><a href="/offers">{t('footer.offers')}</a></li> */}
          </ul>
        </div>
        <div className={styles.quickLinks}>
          <h4>{t('footer.moreInformation')}</h4>
          <ul>
            <li><a href="/about-us">{t('footer.aboutUs')}</a></li>
            <li><a href="/contact-us">{t('footer.contact')}</a></li>
            <li><a href="/privacy-policy">{t('footer.privacyPolicy')}</a></li>
            <li><a href="/terms-and-conditions">{t('footer.termsAndConditions')}</a></li>
            {/* <li><a href="/faq">{t('footer.faq')}</a></li> */}
            {/* <li><a href="/careers">{t('footer.careers')}</a></li> */}

          </ul>
        </div>

        {/* Uncomment and localize if you want to use payment methods: */}
        {/* <div className={styles.paymentMethods}>
          <h4>{t('footer.paymentMethods')}</h4>
          <div className={styles.payments}>
            <Image src="/payments/visa.png" alt={t('footer.visa')} width={50} height={30} />
            <Image src="/payments/mastercard.png" alt={t('footer.mastercard')} width={50} height={30} />
            <Image src="/payments/paypal.png" alt={t('footer.paypal')} width={50} height={30} />
          </div>
        </div> */}
      </div>

      <div className={styles.bottomText}>
           <div className={styles.logo}>
              <Image src="/blastey.ico" alt="Blastey Logo" width={30} height={30} />
          </div>

        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <div className={styles.socialIcons}>
          <a href="https://web.facebook.com/profile.php?id=61568250431523" target="_blank" rel="noopener noreferrer">
            <Image src="/social_icons/facebook.png" alt="Facebook" width={24} height={24} />
          </a>
          <a href="https://www.tiktok.com/@blastey_official?_t=8rOdy8PCO8u&_r=1" target="_blank" rel="noopener noreferrer">
            <Image src="/social_icons/tiktok.png" alt="TikTok" width={24} height={24} />
          </a>
          <a href="https://www.blastey.com/" target="_blank" rel="noopener noreferrer">
            <Image src="/social_icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
          </a>
          <a href="https://www.instagram.com/blastey_official/" target="_blank" rel="noopener noreferrer">
            <Image src="/social_icons/instagram3.png" alt="LinkedIn" width={24} height={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}