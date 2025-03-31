
import React, { useState } from 'react';
import { Bookmark, Plus, Trash, Volume2, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const WordCard = ({ word, definition, partOfSpeech, example, isSaved, onSave, onRemove }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `${word} (${partOfSpeech}): ${definition}${example ? `\nExample: "${example}"` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock function for speech - in a real app, this would use the Web Speech API
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-border transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{word}</h2>
          <div className="flex items-center">
            <span className="text-sm text-primary italic bg-primary/10 px-2 py-0.5 rounded mr-2">
              {partOfSpeech}
            </span>
            <button onClick={speakWord} className="text-muted-foreground hover:text-primary transition-colors p-1">
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-full"
            title="Copy definition"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => window.open(`https://www.google.com/search?q=${word}+meaning`, '_blank')}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/50 rounded-full"
            title="Search online"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          
          {isSaved ? (
            <button 
              onClick={() => onRemove(word)}
              className="flex items-center text-destructive hover:text-destructive/80 transition-colors bg-destructive/10 hover:bg-destructive/20 px-3 py-1.5 rounded-lg"
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Remove</span>
            </button>
          ) : (
            <button 
              onClick={() => onSave({ word, definition, partOfSpeech, example })}
              className="flex items-center text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Save</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">Definition:</h3>
          <p className="text-foreground mt-1">{definition}</p>
        </div>
        
        {example && (
          <div className="border-l-2 border-primary/30 pl-3">
            <h3 className="font-semibold text-foreground">Example:</h3>
            <p className="text-foreground mt-1 italic">"{example}"</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
        <span>Tap the speaker icon to hear pronunciation</span>
        <span>Source: Dictionary API</span>
      </div>
    </div>
  );
};

export default WordCard;
