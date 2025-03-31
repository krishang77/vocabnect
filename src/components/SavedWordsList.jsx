
import React from 'react';
import { bookmark, trash } from 'lucide-react';

const SavedWordsList = ({ savedWords, onRemove }) => {
  if (savedWords.length === 0) {
    return (
      <div className="text-center py-10">
        <bookmark className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-2">Your saved words will appear here</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <bookmark className="h-5 w-5 mr-2 text-primary" />
        Saved Words ({savedWords.length})
      </h2>
      <div className="space-y-3">
        {savedWords.map((word, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm p-4 border border-border flex justify-between items-start"
          >
            <div>
              <div className="flex items-baseline">
                <h3 className="font-medium text-foreground">{word.word}</h3>
                <span className="ml-2 text-xs text-muted-foreground italic">{word.partOfSpeech}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{word.definition}</p>
              {word.example && (
                <p className="text-xs text-muted-foreground mt-1 italic">"{word.example}"</p>
              )}
            </div>
            <button 
              onClick={() => onRemove(word.word)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedWordsList;
