
import React, { useState } from 'react';
import { Bookmark, Trash, ChevronDown, ChevronUp, Search, Volume2 } from 'lucide-react';

const SavedWordsList = ({ savedWords, onRemove }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Group words by first letter
  const groupedWords = savedWords.reduce((acc, word) => {
    const firstLetter = word.word.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(word);
    return acc;
  }, {});

  // Sort letters alphabetically
  const sortedLetters = Object.keys(groupedWords).sort();

  // Filter words based on search
  const filteredWords = savedWords.filter(word => 
    word.word.toLowerCase().includes(searchFilter.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (savedWords.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center mt-6">
        <Bookmark className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
        <p className="text-muted-foreground mt-2">Your saved words will appear here</p>
        <p className="text-xs text-muted-foreground mt-1">Search for words and save them to build your vocabulary</p>
      </div>
    );
  }

  // Mock function for speech - in a real app, this would use the Web Speech API
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bookmark className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Saved Words ({savedWords.length})</h2>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </button>
      </div>

      {expanded && (
        <>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter your vocabulary..."
              className="w-full py-2 px-4 pl-10 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              } transition-colors`}
            >
              All
            </button>
            {sortedLetters.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedCategory(letter)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedCategory === letter 
                    ? 'bg-primary text-white' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                } transition-colors`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            {(selectedCategory === 'all' ? filteredWords : groupedWords[selectedCategory]?.filter(word => 
              word.word.toLowerCase().includes(searchFilter.toLowerCase()) ||
              word.definition.toLowerCase().includes(searchFilter.toLowerCase())
            )).map((word, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-4 border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-foreground">{word.word}</h3>
                      <button 
                        onClick={() => speakWord(word.word)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-2 text-xs text-muted-foreground italic">{word.partOfSpeech}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{word.definition}</p>
                    {word.example && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{word.example}"</p>
                    )}
                  </div>
                  <button 
                    onClick={() => onRemove(word.word)}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedWordsList;
