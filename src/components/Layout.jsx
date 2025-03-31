
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bookmark, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-border">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">VocabNest</h1>
          </Link>
          
          {currentUser && (
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" icon={<Home size={18} />} label="Home" isActive={isActive('/')} />
              <NavLink to="/dashboard" icon={<User size={18} />} label="Dashboard" isActive={isActive('/dashboard')} />
              <NavLink to="/find-word" icon={<Search size={18} />} label="Find Word" isActive={isActive('/find-word')} />
              <NavLink to="/saved-words" icon={<Bookmark size={18} />} label="Saved Words" isActive={isActive('/saved-words')} />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium hidden md:block">
                  {currentUser.displayName || currentUser.email}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
                <Link to="/signup" className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation (only for logged in users) */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-10">
          <div className="flex justify-around py-2">
            <MobileNavLink to="/" icon={<Home className="h-5 w-5" />} label="Home" isActive={isActive('/')} />
            <MobileNavLink to="/dashboard" icon={<User className="h-5 w-5" />} label="Dashboard" isActive={isActive('/dashboard')} />
            <MobileNavLink to="/find-word" icon={<Search className="h-5 w-5" />} label="Find" isActive={isActive('/find-word')} />
            <MobileNavLink to="/saved-words" icon={<Bookmark className="h-5 w-5" />} label="Saved" isActive={isActive('/saved-words')} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow mb-16 md:mb-0">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VocabNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Desktop navigation link
const NavLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-primary/10 text-primary' 
        : 'text-muted-foreground hover:bg-muted/60'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// Mobile navigation link
const MobileNavLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center py-1 px-3 ${
      isActive ? 'text-primary' : 'text-muted-foreground'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Layout;
