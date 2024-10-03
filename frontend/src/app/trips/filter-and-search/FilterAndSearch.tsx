import { FaSearch } from 'react-icons/fa';
import { Dropdown } from '@/app/components';
import styles from './FilterAndSearch.module.css';

interface FilterAndSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
}

const FilterAndSearch: React.FC<FilterAndSearchProps> = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  filterOption,
  setFilterOption
}) => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by trip name or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
        <button onClick={() => console.log("Search triggered")} className={styles.searchButton}>
          <FaSearch className={styles.searchIcon} />
        </button>
      </div>
      <div className={styles.filterControls}>
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Destinations</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="">Sort By</option>
          <option value="price">Price: Low to High</option>
          <option value="rating">Rating: High to Low</option>
        </select>
        <Dropdown options={["test", "test"]} />
      </div>
    </div>
  );
};

export default FilterAndSearch;
