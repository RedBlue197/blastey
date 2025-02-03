import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchTabs from './components/search-tabs/SearchTabs';
import TripsForm from './components/trips-form/TripsForm'; 
import styles from './SearchEngine.module.css'; 
import { CreateTripSearchInterface } from '@/types/trip';
import { createTripSearch } from '@/services/internal_services/trip_api_handler';

const SearchEngine: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('trips');

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleFormSubmit = async (formData: any) => {
    console.log(t('form.data_logged'), formData);
    const tripSearchData: CreateTripSearchInterface = {
      trip_search_origin: formData.origin,
      trip_search_destination: formData.destination,
      trip_search_start_date: formData.departureDate,
      trip_search_end_date: formData.returnDate,
      trip_search_comment: formData.comments,
    };
    
    try {
      const response = await createTripSearch(tripSearchData, 1, 20);
      if (response.status_code === 201) {
        console.log(t('form.success'), response.data);
      } else {
        console.error(t('form.error'), response);
      }
    } catch (error) {
      console.error(t('form.exception'), error);
    }
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
