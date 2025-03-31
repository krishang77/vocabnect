
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash, ChevronDown, ChevronUp, Search, Volume2, Filter, SortAsc, SortDesc, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getUserWords, deleteWordFromFirestore } from '../services/firestoreService';
import { toast } from 'sonner';

const SavedWordsPage = () => {
  const { currentUser } = useAuth();
  const [savedWords, setSavedWords] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'a-z', 'z-a'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const words = await getUserWords(currentUser.uid);
        setSavedWords(words);
      } catch (error) {
        console.error('Error fetching saved words:', error);
        toast.error('Failed to load your saved words');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedWords();
  }, [currentUser]);

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

  // Sort words based on the selected sort order
  const sortWords = (words) => {
    switch (sortOrder) {
      case 'newest':
        return [...words].sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
      case 'oldest':
        return [...words].sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateA - dateB;
        });
      case 'a-z':
        return [...words].sort((a, b) => a.word.localeCompare(b.word));
      case 'z-a':
        return [...words].sort((a, b) => b.word.localeCompare(a.word));
      default:
        return words;
    }
  };

  const sortedFilteredWords = sortWords(filteredWords);

  // Handle word removal
  const handleRemoveWord = async (wordId, wordText) => {
    try {
      await deleteWordFromFirestore(wordId);
      setSavedWords(prev => prev.filter(word => word.id !== wordId));
      toast.success(`"${wordText}" has been removed from your vocabulary list.`);
    } catch (error) {
      console.error('Error removing word:', error);
      toast.error('Failed to remove word. Please try again.');
    }
  };

  // Mock function for speech - in a real app, this would use the Web Speech API
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Vocabulary</h1>
          <Link 
            to="/find-word" 
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Words
          </Link>
        </div>

        {savedWords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center my-12">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-3">No Saved Words Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't saved any words to your vocabulary list. Start by searching for words and saving them for future reference.
            </p>
            <Link 
              to="/find-word" 
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search for Words
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
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
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter your vocabulary..."
                      className="w-full py-2 px-4 pl-10 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative inline-block">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="appearance-none bg-muted/30 border border-border rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">A to Z</option>
                        <option value="z-a">Z to A</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                        {sortOrder === 'newest' || sortOrder === 'oldest' ? (
                          <SortDesc className="h-4 w-4" />
                        ) : (
                          <SortAsc className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 border-t border-border pt-4">
                  <div className="flex items-center mr-2">
                    <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">Filter:</span>
                  </div>
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

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                  {(selectedCategory === 'all' ? sortedFilteredWords : groupedWords[selectedCategory]?.filter(word => 
                    word.word.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    word.definition.toLowerCase().includes(searchFilter.toLowerCase())
                  )).map((word) => (
                    <div 
                      key={word.id} 
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
                            {word.createdAt && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {word.createdAt.toDate().toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground mt-1">{word.definition}</p>
                          {word.example && (
                            <p className="text-xs text-muted-foreground mt-1 italic">"{word.example}"</p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleRemoveWord(word.id, word.word)}
                          className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedCategory !== 'all' && (!groupedWords[selectedCategory] || groupedWords[selectedCategory].length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No words found for this filter.
                  </div>
                )}
                
                {selectedCategory === 'all' && filteredWords.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No words match your search.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedWordsPage;
