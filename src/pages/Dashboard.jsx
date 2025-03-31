
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, Trophy, Clock, Calendar, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { getUserWords, getUserStats } from '../services/firestoreService';
import { toast } from 'sonner';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userWords, setUserWords] = useState([]);
  const [stats, setStats] = useState({
    totalWords: 0,
    recentlyAddedCount: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch user's saved words
        const words = await getUserWords(currentUser.uid);
        setUserWords(words);
        
        // Calculate stats
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        const recentlyAdded = words.filter(word => {
          const wordDate = word.createdAt?.toDate() || new Date();
          return wordDate >= lastWeek;
        });
        
        // Mock streak calculation (in a real app, this would be more sophisticated)
        const streak = Math.min(7, Math.floor(Math.random() * 10));
        
        setStats({
          totalWords: words.length,
          recentlyAddedCount: recentlyAdded.length,
          streak: streak,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Get date for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
        {/* Greeting Section */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            {getGreeting()}, {currentUser.displayName || 'Learner'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your vocabulary progress and continue learning.
          </p>
        </section>
        
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={<Bookmark className="h-5 w-5 text-primary" />}
            title="Total Words"
            value={stats.totalWords}
            description="Words in your collection"
          />
          <StatCard 
            icon={<Clock className="h-5 w-5 text-purple-500" />}
            title="Recently Added"
            value={stats.recentlyAddedCount}
            description="Added in the last 7 days"
          />
          <StatCard 
            icon={<Trophy className="h-5 w-5 text-yellow-500" />}
            title="Learning Streak"
            value={`${stats.streak} days`}
            description="Keep it going!"
          />
        </section>
        
        {/* Quick Actions */}
        <section className="bg-white rounded-xl border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/find-word" 
              className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Find a Word</h3>
                <p className="text-sm text-muted-foreground">Search for new words to learn</p>
              </div>
            </Link>
            <Link 
              to="/saved-words" 
              className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">View Saved Words</h3>
                <p className="text-sm text-muted-foreground">Browse your vocabulary collection</p>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Recent Words */}
        <section className="bg-white rounded-xl border border-border p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recently Added Words</h2>
            <Link to="/saved-words" className="text-primary text-sm hover:underline flex items-center">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {userWords.length > 0 ? (
            <div className="space-y-3">
              {userWords
                .sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
                .slice(0, 5)
                .map((word) => (
                  <div key={word.id} className="flex justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <h3 className="font-medium">{word.word}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {word.definition}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {word.createdAt?.toDate().toLocaleDateString() || 'Recently added'}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bookmark className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">You haven't saved any words yet.</p>
              <Link 
                to="/find-word" 
                className="mt-3 inline-flex items-center text-primary hover:underline"
              >
                Start searching for words
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </section>
        
        {/* Word of the Day */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center text-primary mb-2">
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Word of the Day</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Serendipity</h3>
              <p className="text-muted-foreground mb-3">
                The occurrence and development of events by chance in a happy or beneficial way.
              </p>
              <p className="text-sm text-primary/80 italic">
                "A fortunate stroke of serendipity brought them together."
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary/20 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date().toLocaleDateString()}
            </span>
            <button 
              onClick={() => {
                // In a real app, this would save the word to the user's collection
                toast.success("'Serendipity' saved to your collection!");
              }}
              className="text-xs text-primary flex items-center hover:underline"
            >
              <Bookmark className="h-3 w-3 mr-1" />
              Save this word
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon, title, value, description }) => (
  <div className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-muted-foreground text-sm">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="bg-muted/50 p-2 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
