
import React, { useState } from 'react';
import { Search, Book, Volume2, Plus, Check, History, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { fetchWordDefinition } from '../services/dictionaryService';
import { saveWordToFirestore } from '../services/firestoreService';
import { toast } from 'sonner';

const FindWordPage = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions] = useState(['eloquent', 'pernicious', 'ephemeral', 'ubiquitous', 'serendipity']);

  const handleSearch = async (word) => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError(null);
    setIsSaved(false);
    
    try {
      const result = await fetchWordDefinition(word);
      setSearchResult(result);
      
      // Add to search history if not already there
      if (!searchHistory.includes(word.toLowerCase())) {
        setSearchHistory(prev => [word.toLowerCase(), ...prev].slice(0, 5));
      }
    } catch (err) {
      setError(err.message || 'Failed to find the word');
      toast.error("Word not found. Please check your spelling and try again.");
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim());
    }
  };

  const handleSuggestionClick = (word) => {
    setSearchTerm(word);
    handleSearch(word);
  };

  const handleSaveWord = async () => {
    if (!searchResult) return;
    
    try {
      await saveWordToFirestore(currentUser.uid, searchResult);
      setIsSaved(true);
      toast.success(`"${searchResult.word}" has been added to your vocabulary list.`);
    } catch (error) {
      console.error('Error saving word:', error);
      toast.error("Failed to save the word. Please try again.");
    }
  };

  // Mock function for speech - in a real app, this would use the Web Speech API
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find a Word</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-8">
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
            <div className="mt-2 bg-white rounded-lg shadow-md border border-border p-3 absolute z-10 w-full max-w-3xl">
              <div className="mb-3">
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
              
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <History className="h-3.5 w-3.5 mr-1.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((word, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(word)}
                        className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-pulse">
              <div className="h-7 bg-muted rounded w-1/4 mx-auto mb-3"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && !searchResult && (
          <div className="bg-white rounded-xl shadow-sm border border-destructive/30 p-6 text-center">
            <p className="text-destructive font-medium mb-2">{error}</p>
            <p className="text-muted-foreground">Please check your spelling and try again.</p>
          </div>
        )}
        
        {/* Search Result */}
        {searchResult && !loading && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-border transition-all hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{searchResult.word}</h2>
                <div className="flex items-center">
                  <span className="text-sm text-primary italic bg-primary/10 px-2 py-0.5 rounded mr-2">
                    {searchResult.partOfSpeech}
                  </span>
                  <button onClick={() => speakWord(searchResult.word)} className="text-muted-foreground hover:text-primary transition-colors p-1">
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleSaveWord}
                disabled={isSaved}
                className={`flex items-center ${
                  isSaved ? 'text-green-600 bg-green-50' : 'text-primary bg-primary/10 hover:bg-primary/20'
                } px-3 py-1.5 rounded-lg transition-colors`}
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Saved</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Save</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">Definition:</h3>
                <p className="text-foreground mt-1">{searchResult.definition}</p>
              </div>
              
              {searchResult.example && (
                <div className="border-l-2 border-primary/30 pl-3">
                  <h3 className="font-semibold text-foreground">Example:</h3>
                  <p className="text-foreground mt-1 italic">"{searchResult.example}"</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
              <span>Tap the speaker icon to hear pronunciation</span>
              <span>Source: Dictionary API</span>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!searchResult && !loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center my-12">
            <div className="bg-primary/10 inline-flex items-center justify-center p-6 rounded-full mb-4">
              <Book className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Search for a Word</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Type a word in the search box above to discover its meaning, pronunciation, and usage examples.
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <p className="text-sm text-muted-foreground w-full mb-2">Try these examples:</p>
              {suggestions.map((word) => (
                <button
                  key={word}
                  onClick={() => handleSuggestionClick(word)}
                  className="bg-secondary/70 text-secondary-foreground px-3 py-1 rounded-md text-sm hover:bg-secondary transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FindWordPage;
