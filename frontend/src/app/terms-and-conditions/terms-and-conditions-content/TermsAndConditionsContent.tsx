// src/app/components/TermsAndConditionsContent.tsx
import React from 'react';
import styles from './TermsAndConditionsContent.module.css';
import { useTranslation } from 'react-i18next';

const TermsAndConditionsContent = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.termsAndConditionsContainer}>
            <h1>{t('terms-and-conditions.title')}</h1>

            <p>{t('terms-and-conditions.effectiveDate')}</p>

            <h2>{t('terms-and-conditions.acceptanceOfTerms')}</h2>
            <p>{t('terms-and-conditions.acceptanceDetails')}</p>

            {/* ... other sections for your terms and conditions ... */}
            <h2>{t('terms-and-conditions.accountCreation')}</h2>
            <p>{t('terms-and-conditions.accountDetails')}</p>



            <h2>{t('terms-and-conditions.prohibitedActivities')}</h2>
            <ul>
                {Array.from(t('terms-and-conditions.prohibitedList', { returnObjects: true }) as Array<string>).map((item, index) => (
                <li key={index}><p className={styles.listItemText}>{item}</p></li>
                ))}
            </ul>

            <h2>{t('terms-and-conditions.intellectualProperty')}</h2>
             <p>{t('terms-and-conditions.intellectualDetails')}</p>

            <h2>{t('terms-and-conditions.termination')}</h2>
            <p>{t('terms-and-conditions.terminationDetails')}</p>



            <h2>{t('terms-and-conditions.governingLaw')}</h2>
            <p>{t('terms-and-conditions.governingDetails')}</p>


            <h2>{t('terms-and-conditions.changesToTerms')}</h2>
            <p>{t('terms-and-conditions.changesDetails')}</p>

            <h2>{t('terms-and-conditions.contactUs')}</h2>
            <p>{t('terms-and-conditions.contactDetails')}</p>

        </div>
    );
};

export default TermsAndConditionsContent;