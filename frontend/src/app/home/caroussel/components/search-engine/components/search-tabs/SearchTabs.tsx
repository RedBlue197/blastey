import React from 'react';
import styles from './SearchTabs.module.css'; // Assuming the CSS module is named Tabs.module.css

interface SearchTabsProps {
  onTabChange: (tab: string) => void;
  activeTab: string; // Add activeTab prop
}

const SearchTabs: React.FC<SearchTabsProps> = ({ onTabChange, activeTab }) => {
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
      {/* Add other tabs like hotels, car rentals, etc */}
    </div>
  );
};

export default SearchTabs;
