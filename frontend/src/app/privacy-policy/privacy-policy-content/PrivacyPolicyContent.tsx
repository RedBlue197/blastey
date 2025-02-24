// src/app/components/PrivacyPolicyContent.tsx
import React from 'react';
import styles from './PrivacyPolicyContent.module.css'; // Create this CSS module
import { useTranslation } from 'react-i18next';

const PrivacyPolicyContent = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.privacyPolicyContainer}>
            <h1>{t('privacy-policy.title')}</h1>

            <p>{t('privacy-policy.effectiveDate')}</p>

            <h2>{t('privacy-policy.informationWeCollect')}</h2>
            <p>{t('privacy-policy.informationWeCollectDetails')}</p>


            {/* ... other sections of your privacy policy ... */}

            <h2>{t('privacy-policy.changesToThisPolicy')}</h2>
             <p>{t('privacy-policy.changesDetails')}</p>

            <h2>{t('privacy-policy.contactUs')}</h2>
            <p>{t('privacy-policy.contactDetails')}</p>



        </div>
    );
};

export default PrivacyPolicyContent;