
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto my-6">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a word..."
          className="w-full py-3 px-4 pl-12 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
        />
        <Search className="absolute left-4 text-muted-foreground h-5 w-5" />
        <button
          type="submit"
          className="absolute right-3 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
