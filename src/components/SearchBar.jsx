
import React, { useState } from 'react';
import { Search, Book, Sparkles, History } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [suggestions] = useState(['eloquent', 'pernicious', 'ephemeral', 'ubiquitous']);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSuggestionClick = (word) => {
    setSearchTerm(word);
    onSearch(word);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setTimeout(() => setIsActive(false), 200)}
            placeholder="Search for a word..."
            className="w-full py-3.5 px-4 pl-12 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
          />
          <Search className="absolute left-4 text-muted-foreground h-5 w-5" />
          <button
            type="submit"
            className="absolute right-3 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {isActive && (
        <div className="mt-2 bg-white rounded-lg shadow-md border border-border p-3 absolute z-10 w-full max-w-2xl">
          <div className="mb-2">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              <span>Suggested Words</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((word) => (
                <button
                  key={word}
                  onClick={() => handleSuggestionClick(word)}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm hover:bg-secondary/80 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <History className="h-3.5 w-3.5 mr-1.5" />
              <span>Try these examples</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Book className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm">Try searching for "serendipity" or "quintessential"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
