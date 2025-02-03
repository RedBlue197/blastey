import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoAndContact}>
          <div className={styles.contactInfo}>
            <h4>Contact Us</h4>
            <p>Email: contact@Blastey.com</p>
          </div>
        </div>
        <div className={styles.quickLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/trips">Trips</a></li>
          </ul>
        </div>
        <div className={styles.quickLinks}>
          <h4>More informations</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Conditions & Terms of Service</a></li>

          </ul>
        </div>
        {/* <div className={styles.paymentMethods}>
          <h4>Payment Methods</h4>
          <div className={styles.payments}>
            <Image src="/payments/visa.png" alt="Visa" width={50} height={30} />
            <Image src="/payments/mastercard.png" alt="Mastercard" width={50} height={30} />
            <Image src="/payments/paypal.png" alt="PayPal" width={50} height={30} />
          </div>
        </div> */}
      </div>
      <div className={styles.bottomText}>
        <p>© 2025 Blastey. All rights reserved.</p>
        <div className={styles.logo}>
            <Image src="/blastey.ico" alt="Blastey Logo" width={30} height={30} />
          </div>
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
