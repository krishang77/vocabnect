
import React from 'react';
import { BookOpen, Search, Award, Lightbulb } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-border p-8 text-center my-12">
      <div className="bg-primary/10 inline-flex items-center justify-center p-6 rounded-full mb-4">
        <BookOpen className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Build Your Vocabulary</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Search for words to discover their meanings and save them to your personal vocabulary list.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="bg-muted/30 p-4 rounded-lg">
          <Search className="h-6 w-6 text-primary mx-auto mb-2" />
          <h3 className="font-medium mb-1">Search Words</h3>
          <p className="text-sm text-muted-foreground">
            Look up any word to find its definition and example usage
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <Award className="h-6 w-6 text-primary mx-auto mb-2" />
          <h3 className="font-medium mb-1">Save Favorites</h3>
          <p className="text-sm text-muted-foreground">
            Build your personal collection of vocabulary words
          </p>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <Lightbulb className="h-6 w-6 text-primary mx-auto mb-2" />
          <h3 className="font-medium mb-1">Expand Knowledge</h3>
          <p className="text-sm text-muted-foreground">
            Improve your language skills with a curated vocabulary list
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center">
        <Search className="h-5 w-5 mr-2 text-primary animate-pulse" />
        <span className="text-primary font-medium">Search for your first word above</span>
      </div>
    </div>
  );
};

export default EmptyState;
