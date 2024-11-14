// components/Newsletter.js
"use client";
import styles from './Newsletter.module.css';
import {createNewsletter} from '@/services/internal_services/newsletter_api_handler';
import { useState } from 'react';



const Newsletter = () => {
    const [email, setEmail] = useState<string>('');

    
    const handleNewsletterSubscription = async () => {

    // Implement your newsletter subscription logic here
    const data={
        newsletter_email :email
    }
    const response = createNewsletter(data);
    console.log('Response:', response);
    }
    return (
        <div className={styles.newsletterContainer}>
            <div className={styles.newsletterImage}>
                <img
                    src="/newsletter.jpg" // Replace with your image URL
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
                        onChange={e => setEmail(e.target.value)}    
                        className={styles.emailInput}
                    />
                    <button type="submit" className={styles.subscribeButton} onClick={handleNewsletterSubscription}>
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
