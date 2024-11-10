import React, { useState } from 'react';
import SearchTabs from './components/search-tabs/SearchTabs';
import TripsForm from './components/trips-form/TripsForm'; 
import styles from './SearchEngine.module.css'; 
import { CreateTripSearchInterface } from '@/types/trip';

import {createTripSearch} from '@/services/internal_services/trip_api_handler';

const SearchEngine: React.FC = () => {

  const [selectedTab, setSelectedTab] = useState<string>('trips');

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleFormSubmit = (formData: any) => {
    console.log('Form data:', formData);
    const trip_search_data: CreateTripSearchInterface = {
      trip_search_origin: formData.origin,
      trip_search_destination: formData.destination,
      trip_search_start_date: formData.departureDate,
      trip_search_end_date: formData.returnDate,
      trip_search_comment: formData.comments,
    }
    console.log('Trip search data:', trip_search_data);
    const response = createTripSearch(trip_search_data,1,20);
    console.log('Response:', response);
  };

  return (
    <div className={styles.searchEngine}>
      <div className={styles.tabs}>
        <SearchTabs onTabChange={handleTabChange} activeTab={selectedTab} />
      </div>
      <div className={styles.searchFormRow}>
      <div className={styles.searchForm}>
        {selectedTab === 'trips' && <TripsForm onSubmit={handleFormSubmit} />}
      </div>
      </div>
    </div>
  );
};

export default SearchEngine;
