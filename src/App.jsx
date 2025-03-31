
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import SavedWordsList from './components/SavedWordsList';
import EmptyState from './components/EmptyState';
import { fetchWordDefinition } from './services/dictionaryService';
import { getSavedWords, saveWord, removeWord } from './services/storageService';

const App = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved words from local storage
    setSavedWords(getSavedWords());
  }, []);

  const handleSearch = async (word) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchWordDefinition(word);
      setSearchResult(result);
    } catch (err) {
      setError(err.message || 'Failed to find the word');
      toast({
        title: "Word not found",
        description: "Please check your spelling and try again.",
        variant: "destructive"
      });
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = (wordData) => {
    const updatedWords = saveWord(wordData);
    setSavedWords(updatedWords);
    toast({
      title: "Word saved",
      description: `"${wordData.word}" has been added to your vocabulary list.`,
    });
  };

  const handleRemoveWord = (word) => {
    const updatedWords = removeWord(word);
    setSavedWords(updatedWords);
    toast({
      title: "Word removed",
      description: `"${word}" has been removed from your vocabulary list.`,
    });
  };

  const isWordSaved = (word) => {
    return savedWords.some(item => item.word.toLowerCase() === word.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <SearchBar onSearch={handleSearch} />
        
        {loading && (
          <div className="text-center py-10">
            <div className="animate-pulse">
              <div className="h-7 bg-muted rounded w-1/4 mx-auto mb-3"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}
        
        {error && !loading && !searchResult && (
          <div className="text-center py-6">
            <p className="text-destructive">{error}</p>
            <p className="text-muted-foreground mt-1">Please check your spelling and try again.</p>
          </div>
        )}
        
        {searchResult && !loading && (
          <WordCard 
            word={searchResult.word}
            definition={searchResult.definition}
            partOfSpeech={searchResult.partOfSpeech}
            example={searchResult.example}
            isSaved={isWordSaved(searchResult.word)}
            onSave={handleSaveWord}
            onRemove={handleRemoveWord}
          />
        )}
        
        {!searchResult && !loading && !error && savedWords.length === 0 && <EmptyState />}
        
        <SavedWordsList savedWords={savedWords} onRemove={handleRemoveWord} />
      </main>
    </div>
  );
};

export default App;
