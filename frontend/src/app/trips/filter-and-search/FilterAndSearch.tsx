import { FaSearch } from 'react-icons/fa';

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
    <div className="filterSection">
      <div className="searchContainer">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Search by trip name or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="searchBar"
        />
      </div>
      <div className="filterControls">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="filterSelect"
        >
          <option value="">All Destinations</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sortSelect"
        >
          <option value="">Sort By</option>
          <option value="price">Price: Low to High</option>
          <option value="rating">Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterAndSearch;
