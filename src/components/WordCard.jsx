
import React from 'react';
import { bookmark, plus, trash } from 'lucide-react';

const WordCard = ({ word, definition, partOfSpeech, example, isSaved, onSave, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-border">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{word}</h2>
          <p className="text-sm text-muted-foreground italic">{partOfSpeech}</p>
        </div>
        {isSaved ? (
          <button 
            onClick={() => onRemove(word)}
            className="flex items-center text-destructive hover:text-destructive/80 transition-colors"
          >
            <trash className="h-5 w-5 mr-1" />
            <span className="text-sm">Remove</span>
          </button>
        ) : (
          <button 
            onClick={() => onSave({ word, definition, partOfSpeech, example })}
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <plus className="h-5 w-5 mr-1" />
            <span className="text-sm">Save</span>
          </button>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="font-semibold text-foreground">Definition:</h3>
        <p className="text-foreground mt-1">{definition}</p>
      </div>
      
      {example && (
        <div className="mt-3">
          <h3 className="font-semibold text-foreground">Example:</h3>
          <p className="text-foreground mt-1 italic">"{example}"</p>
        </div>
      )}
    </div>
  );
};

export default WordCard;
