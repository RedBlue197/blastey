// src/components/Carousel.tsx
"use client"
import React, { useState } from 'react';
import SearchEngine from './components/search-engine/SearchEngine';
import styles from './Carousel.module.css';

const fullWidthImage = '/cover.jpeg'; // Adjust as needed

export default function Carousel() {

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={fullWidthImage} alt="Full-width" className={styles.fullWidthImage} />
      </div>
      <div className={styles.searchEngineWrapper}>
        <SearchEngine/>
      </div>
    </div>
  );
}
