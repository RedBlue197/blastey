// src/app/components/AboutUsContent.tsx
import React from 'react';
import styles from './AboutUsContent.module.css';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const AboutUsContent = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.aboutUsContainer}>
            <div className={styles.imageContainer}>
                <Image
                    src="/blastey_group.jpg"
                    alt="Blastey Team"
                    width={900}
                    height={400}
                    layout="responsive"
                    className={styles.aboutUsImage}
                />
            </div>

            <h2 className={styles.aboutUsTitle}>{t('about-us.title')}</h2>

            <p className={styles.aboutUsParagraph}>{t('about-us.paragraph1')}</p>
            <p className={styles.aboutUsParagraph}>{t('about-us.paragraph2')}</p>

            <h3 className={styles.aboutUsSubtitle}>{t('about-us.subtitle')}</h3>

            <ul className={styles.aboutUsList}>

            {Object.values(t('about-us.listItems', { returnObjects: true })).map((item, index) => (
                                <li key={index}><p className={styles.listItemText}>{item}</p></li>
                            ))}
            </ul>

            <p className={styles.aboutUsParagraph}>{t('about-us.closingParagraph')}</p>

            <p className={styles.signatureText}>{t('about-us.signature')}</p>
        </div>
    );
};

export default AboutUsContent;