// components/Newsletter.js

import styles from './Newsletter.module.css';

const Newsletter = () => {
    return (
        <div className={styles.newsletterContainer}>
            <div className={styles.newsletterImage}>
                <img
                    src="https://picsum.photos/400/300" // Replace with your image URL
                    alt="Newsletter"
                />
            </div>
            <div className={styles.newsletterContent}>
                <h2>Subscribe to Our Newsletter</h2>
                <p>Get the latest updates and offers directly in your inbox.</p>
                <form className={styles.subscribeForm}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        className={styles.emailInput}
                    />
                    <button type="submit" className={styles.subscribeButton}>
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
