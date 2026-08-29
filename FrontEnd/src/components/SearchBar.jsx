import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full max-w-xl mx-auto">
      <div className="relative w-full flex">
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full h-10 px-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-l focus:outline-none focus:border-gray-900 transition-colors duration-300"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-12 h-10 bg-gray-900 hover:bg-black text-white rounded-r focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
