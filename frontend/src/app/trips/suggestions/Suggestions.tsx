import React from 'react';
import styles from './Suggestions.module.css';

interface Suggestion {
  id: string;
  title: string;
  price: string;
  days: number;
  image: string;
}

const suggestions: Suggestion[] = [
  { id: '1', title: 'Explore the Sahara', price: '$500', days: 7, image: 'https://picsum.photos/300/300' },
  { id: '2', title: 'Discover Marrakech', price: '$300', days: 5, image: 'https://picsum.photos/300/300' },
  { id: '3', title: 'Atlas Mountains', price: '$400', days: 4, image: 'https://picsum.photos/300/300' },
  { id: '4', title: 'Essaouira Escape', price: '$250', days: 3, image: 'https://picsum.photos/300/300' },
  { id: '5', title: 'Tangier Tour', price: '$450', days: 6, image: 'https://picsum.photos/300/300' },
];

const Suggestions: React.FC = () => {
  return (
    <div className={styles.suggestionsWrapper}>
      <div className={styles.suggestionsContainer}>
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className={styles.card} style={{ backgroundImage: `url(${suggestion.image})` }}>
            <div className={styles.cardContent}>
              <span className={styles.tag}>{suggestion.title}</span>
              <p className={styles.price}>{suggestion.price}</p>
              <p className={styles.days}>{suggestion.days} Days</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
