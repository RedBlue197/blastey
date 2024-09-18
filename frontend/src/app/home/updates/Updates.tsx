// components/UpdatesSection.js
import Image from 'next/image';
import Link from 'next/link';
import styles from './Updates.module.css'; // Import the CSS module

const updates = [
    {
        id: 1,
        imageUrl: 'https://static.avianca.com/media/qfbptgkb/fotografia_mujer_lifemiles-red-plus-elite.png',
        title: 'Flying within Colombia',
        description: 'You can obtain your Red Plus Elite status with special offers.',
        link: 'https://www.lifemiles.com/bonus-subscription2x1/en/wr/RPSCOL24?utm_source=avianca&utm_medium=banner_secundario&utm_campaign=red_plus_elite',
        linkText: 'Subscribe now'
    },
    {
        id: 2,
        imageUrl: 'https://static-nuxqa.avtest.ink/media/rmjbo5dg/thumbnail_cob_generica.png',
        title: 'Your Credit Card with',
        description: 'Up to 20,000 welcome miles.',
        link: 'https://www.lifemiles.com/credit-card/get-credit-card?utm_source=avianca&utm_medium=banner_secundario&utm_campaign=tarjeta_credito_lifemiles',
        linkText: 'Apply now!'
    },
    {
        id: 3,
        imageUrl: 'https://static.avianca.com/media/s1xbhmpk/banner-star.jpg',
        title: 'Some take to the sky',
        description: 'We soar among stars.',
        link: 'https://www.staralliance.com/en/home',
        linkText: 'Find out more'
    },
    {
        id: 4,
        imageUrl: 'https://static.avianca.com/media/o02jxfzj/card_bussiness_es.png',
        title: 'Fly in Business Class',
        description: 'Enhance your experience with our Business Class services.',
        link: 'https://www.avianca.com/en/your-booking/business-class/',
        linkText: 'Learn more'
    }
];

const Updates = () => {
    return (
        <div className={styles.updatesContainer}>
            {updates.map(update => (
                <div key={update.id} className={styles.updateItem}>
                    <div className={styles.updateImage}>
                        <Image
                            src={update.imageUrl}
                            alt={update.title}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className={styles.updateContent}>
                        <div className={styles.updateTitle}>{update.title}</div>
                        <div className={styles.updateDescription}>{update.description}</div>
                        <div className={styles.updateLinkContainer}>
                            <div className={styles.updateLink}>
                            <Link href={update.link} target="_blank" rel="noopener noreferrer">
                                {update.linkText}
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Updates;
