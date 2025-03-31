
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Award, Lightbulb, ArrowRight, Bookmark } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 px-3 rounded-full bg-primary/10 text-primary mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Unlock Your Vocabulary</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Build Your Vocabulary with <span className="text-primary">VocabNest</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search for words, discover their meanings, and build your personal
              collection to enhance your language skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {currentUser ? (
                <>
                  <Link 
                    to="/find-word" 
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search Words
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 border-t border-border">
          <h2 className="text-2xl font-bold text-center mb-10">How VocabNest Helps You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-primary" />}
              title="Search & Learn"
              description="Look up any word to find its definition, pronunciation, and example usage."
            />
            <FeatureCard 
              icon={<Bookmark className="h-8 w-8 text-primary" />}
              title="Save & Organize"
              description="Build your personal collection of vocabulary words for easy reference."
            />
            <FeatureCard 
              icon={<Award className="h-8 w-8 text-primary" />}
              title="Track Progress"
              description="Monitor your vocabulary growth and learning milestones."
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16 border-t border-border text-center">
          <div className="bg-muted/50 p-8 rounded-xl">
            <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Expand Your Vocabulary?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of learners who are building their vocabulary one word at a time.
            </p>
            {currentUser ? (
              <Link 
                to="/find-word" 
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Search className="mr-2 h-5 w-5" />
                Start Searching Words
              </Link>
            ) : (
              <Link 
                to="/signup" 
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all">
    <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default HomePage;
