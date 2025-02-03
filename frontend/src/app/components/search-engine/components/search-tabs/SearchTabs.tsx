// components/search-tabs/SearchTabs.tsx
import React from 'react';
import styles from './SearchTabs.module.css'; // Ensure this path matches your project structure

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'trips' ? styles.active : ''}`}
        onClick={() => onTabChange('trips')}
      >
        Trips
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'activities' ? styles.active : ''}`}
        onClick={() => onTabChange('activities')}
      >
        Activities
      </button>
      
    </div>
  );
};

export default SearchTabs;
