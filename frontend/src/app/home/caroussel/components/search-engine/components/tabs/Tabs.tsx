import React, { useState } from 'react';
import styles from './Tabs.module.css';

type RouteType = 'one-way' | 'round-trip';

interface TabsProps {
  onTabChange: (routeType: RouteType) => void;
}

export default function Tabs({ onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<RouteType>('one-way');

  const handleTabClick = (routeType: RouteType) => {
    setActiveTab(routeType);
    onTabChange(routeType);
  };

  return (
    <div className={styles.journeyTypeRadio}>
      <div className={styles.journeyTypeRadioItem}>
        <input
          id="journeytypeId_0"
          name="journeyTypeSelector"
          type="radio"
          value="round-trip"
          checked={activeTab === 'round-trip'}
          onChange={() => handleTabClick('round-trip')}
          className={styles.radioInput}
        />
        <label htmlFor="journeytypeId_0" className={styles.tab}>
          <span className={styles.labelText}>Round trip</span>
        </label>
      </div>
      <div className={styles.journeyTypeRadioItem}>
        <input
          id="journeytypeId_1"
          name="journeyTypeSelector"
          type="radio"
          value="one-way"
          checked={activeTab === 'one-way'}
          onChange={() => handleTabClick('one-way')}
          className={styles.radioInput}
        />
        <label htmlFor="journeytypeId_1" className={styles.tab}>
          <span className={styles.labelText}>One way</span>
        </label>
      </div>
    </div>
  );
}
