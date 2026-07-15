'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './Icons.jsx';

/**
 * Reusable and accessible SearchInput component.
 * Supports suggestions, category filtering, and keyboard navigation.
 */
export const SearchInput = ({
  placeholder = 'Search products, styles, categories...',
  onSearch = (query) => console.log('Searching for:', query),
  onInputChange = (val) => {},
  suggestions = [
    { id: 's1', text: 'Designer Kurtas', type: 'category' },
    { id: 's2', text: 'Traditional Kurtis', type: 'product' },
    { id: 's3', text: 'Silk Sherwani', type: 'product' },
    { id: 's4', text: 'Mens Ethnic Vest', type: 'product' },
  ],
  onSuggestionClick = (suggestion) => console.log('Suggestion selected:', suggestion),
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  // Filter suggestions locally for UI demonstration
  const filteredSuggestions = query
    ? suggestions.filter((item) =>
        item.text.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
        e.preventDefault();
        selectSuggestion(filteredSuggestions[activeIndex]);
      } else {
        handleSubmit(e);
      }
    }
  };

  const selectSuggestion = (item) => {
    setQuery(item.text);
    setIsOpen(false);
    setActiveIndex(-1);
    onSuggestionClick(item);
    onSearch(item.text);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setActiveIndex(-1);
    onInputChange(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-md ${className}`}
      onKeyDown={handleKeyDown}
    >
      <form onSubmit={handleSubmit} role="search" className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search products
        </label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 py-2 pl-10 pr-4 text-xs text-neutral-800 transition-all duration-300 placeholder:text-neutral-400 focus:border-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20"
          aria-autocomplete="list"
          aria-expanded={isOpen && filteredSuggestions.length > 0}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-4 w-4 text-neutral-400" />
        </div>
      </form>

      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          {filteredSuggestions.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={item.id}
                role="option"
                aria-selected={isActive}
                onClick={() => selectSuggestion(item)}
                className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm transition ${
                  isActive ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>{item.text}</span>
                <span className="text-xs text-neutral-400 capitalize">{item.type}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
