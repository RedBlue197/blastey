import React, { useState } from 'react';
import SearchTabs from './components/search-tabs/SearchTabs';
import TripsForm from './components/trips-form/TripsForm'; 
import ActivitiesForm from './components/activities-form/ActivitiesForm'; 

import styles from './SearchEngine.module.css'; 

const SearchEngine: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('trips');

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleFormSubmit = (formData: any) => {
    console.log('Form data:', formData);
    // Add search logic or API calls here based on the selected tab
  };

  return (
    <div className={styles.searchEngine}>
      <div className={styles.tabs}>
        <SearchTabs onTabChange={handleTabChange} activeTab={selectedTab} />
      </div>
      <div className={styles.searchForm}>
        {selectedTab === 'trips' && <TripsForm onSubmit={handleFormSubmit} />}
        {selectedTab === 'activities' && <ActivitiesForm onSubmit={handleFormSubmit} />}
      </div>
    </div>
  );
};

export default SearchEngine;
