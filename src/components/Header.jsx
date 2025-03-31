
import React from 'react';
import { BookOpen, Search, Bookmark, Settings, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-border">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">VocabNest</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <Info className="h-5 w-5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <h3 className="font-medium">About VocabNest</h3>
                <p className="text-sm text-muted-foreground">
                  VocabNest helps you build your vocabulary by saving words you discover.
                  Search for words, learn their meanings, and save them for future reference.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted transition-colors">
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-6">
                <h2 className="text-lg font-semibold mb-4">Recent Vocabulary</h2>
                <p className="text-sm text-muted-foreground">
                  Your recently saved words will appear here for quick access.
                </p>
              </div>
            </SheetContent>
          </Sheet>
          
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
