
import React from 'react';
import { book, search } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-primary/5 inline-flex items-center justify-center p-6 rounded-full mb-4">
        <book className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Build Your Vocabulary</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Search for words to discover their meanings and save them to your personal vocabulary list.
      </p>
      <div className="mt-6 flex items-center justify-center">
        <search className="h-5 w-5 mr-2 text-primary" />
        <span className="text-primary">Search for your first word above</span>
      </div>
    </div>
  );
};

export default EmptyState;
