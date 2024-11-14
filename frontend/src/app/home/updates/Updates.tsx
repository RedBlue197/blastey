// components/UpdatesSection.js
import Image from 'next/image';
import Link from 'next/link';
import styles from './Updates.module.css'; // Import the CSS module

const updates = [
    {
        id: 1,
        imageUrl: '/cities_images/marrakech.jpg',
        title: 'Marrakech',
        description: '',
        link: `/trips/by-city-name/Marrakesh`,
        linkText: 'Find trips'
    },
    {
        id: 2,
        imageUrl: '/cities_images/fes.jpg',
        title: 'Fes',
        description: '',
        link: `/trips/by-city-name/Fes`,
        linkText: 'Find trips'
    },
    {
        id: 3,
        imageUrl: '/cities_images/tangier.webp',
        title: 'Tangier',
        description: '',
        link:`/trips/by-city-name/Tangier`,
        linkText: 'Find trips'
    },
    {
        id: 4,
        imageUrl: '/cities_images/casablanca.webp',
        title: 'Casablanca',
        description: '',
        link: `/trips/by-city-name/Casablanca`,
        linkText: 'Find trips'
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
