import React from "react";
import { FaTimes } from "react-icons/fa";

const GENDER_OPTIONS = ["male", "female", "unisex"];
const SIZE_OPTIONS = ["s", "m", "xl", "xxl"];

const FilterSection = ({ title, children }) => (
  <div className="py-4 first:pt-0 last:pb-0 border-b border-gray-200 last:border-b-0">
    <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
      {title}
    </h4>
    {children}
  </div>
);

const CheckboxRow = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1 text-sm text-gray-600 cursor-pointer hover:text-black">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
    />
    <span className="capitalize">{label}</span>
  </label>
);

const FilterSidebar = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  selectedGenders,
  onGenderChange,
  selectedSizes,
  onSizeChange,
  onReset,
}) => {
  const step = Math.max(1, Math.round((maxPrice - minPrice) / 200));

  const handleMinSlider = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - step);
    onPriceRangeChange([value, priceRange[1]]);
  };

  const handleMaxSlider = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + step);
    onPriceRangeChange([priceRange[0], value]);
  };

  const handleMinInput = (e) => {
    const value = Math.min(Math.max(Number(e.target.value) || 0, minPrice), priceRange[1] - step);
    onPriceRangeChange([value, priceRange[1]]);
  };

  const handleMaxInput = (e) => {
    const value = Math.max(Math.min(Number(e.target.value) || 0, maxPrice), priceRange[0] + step);
    onPriceRangeChange([priceRange[0], value]);
  };

  const minPct = ((priceRange[0] - minPrice) / (maxPrice - minPrice || 1)) * 100;
  const maxPct = ((priceRange[1] - minPrice) / (maxPrice - minPrice || 1)) * 100;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`${
          isOpen ? "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto" : "hidden"
        } lg:static lg:block lg:w-64 lg:shrink-0 lg:z-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4 h-fit`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="text-xs font-medium text-gray-700 hover:text-black underline"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <FilterSection title="Price Range">
          <div className="relative h-1 bg-gray-200 rounded-full mt-6 mb-4">
            <div
              className="absolute h-1 bg-gray-900 rounded-full"
              style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={priceRange[0]}
              onChange={handleMinSlider}
              className="range-slider absolute w-full h-1 top-0"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={step}
              value={priceRange[1]}
              onChange={handleMaxSlider}
              className="range-slider absolute w-full h-1 top-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={handleMinInput}
              min={minPrice}
              max={priceRange[1]}
              className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={handleMaxInput}
              min={priceRange[0]}
              max={maxPrice}
              className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </FilterSection>

        {categories && categories.length > 0 && (
          <FilterSection title="Category">
            {categories.map((c) => (
              <CheckboxRow
                key={c}
                label={c}
                checked={selectedCategories.includes(c.toLowerCase())}
                onChange={() => onCategoryChange(c.toLowerCase())}
              />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Gender">
          {GENDER_OPTIONS.map((g) => (
            <CheckboxRow
              key={g}
              label={g}
              checked={selectedGenders.includes(g)}
              onChange={() => onGenderChange(g)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Size">
          {SIZE_OPTIONS.map((s) => (
            <CheckboxRow
              key={s}
              label={s.toUpperCase()}
              checked={selectedSizes.includes(s)}
              onChange={() => onSizeChange(s)}
            />
          ))}
        </FilterSection>
      </aside>
    </>
  );
};

export default FilterSidebar;
