import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoAndContact}>
          <div className={styles.logo}>
            <Image src="/logo.png" alt="Seftly Logo" width={150} height={50} />
          </div>
          <div className={styles.contactInfo}>
            <h4>Contact Us</h4>
            <p>Email: support@seftly.com</p>
            <p>Phone: +1 (234) 567-8901</p>
            <p>Address: 1234 Street Name, City, Country</p>
          </div>
        </div>
        <div className={styles.quickLinks}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">Offers</a></li>
            <li><a href="/services">Requests</a></li>
            <li><a href="/contact">Products</a></li>
          </ul>
        </div>
        <div className={styles.quickLinks}>
          <h4>More informations</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>

          </ul>
        </div>
        <div className={styles.paymentMethods}>
          <h4>Payment Methods</h4>
          <div className={styles.payments}>
            <Image src="/payments/visa.png" alt="Visa" width={50} height={30} />
            <Image src="/payments/mastercard.png" alt="Mastercard" width={50} height={30} />
            <Image src="/payments/paypal.png" alt="PayPal" width={50} height={30} />
          </div>
        </div>
      </div>
      <div className={styles.bottomText}>
        <p>© 2024 Seftly. All rights reserved.</p>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com/seftly" target="_blank" rel="noopener noreferrer">
            <Image src="/social/facebook.svg" alt="Facebook" width={24} height={24} />
          </a>
          <a href="https://twitter.com/seftly" target="_blank" rel="noopener noreferrer">
            <Image src="/social/twitter.svg" alt="Twitter" width={24} height={24} />
          </a>
          <a href="https://linkedin.com/company/seftly" target="_blank" rel="noopener noreferrer">
            <Image src="/social/linkedin.svg" alt="LinkedIn" width={24} height={24} />
          </a>
        </div>
        </div>
    </footer>
  );
}
