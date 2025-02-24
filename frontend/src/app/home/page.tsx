"use client";

import Caroussel from "./caroussel/Carousel";
import Updates from "./updates/Updates";
import Newsletter from "./newsletter/Newsletter";
import SearchEngine from '@/app/components/search-engine/SearchEngine';

export default function Home() {
    return (
      <main>
        <Caroussel/>
         <Updates/>
        <Newsletter/>
      </main>
    );
  }
  