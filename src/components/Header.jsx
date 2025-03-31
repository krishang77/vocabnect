
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">VocabNest</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
