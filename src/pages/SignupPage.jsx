
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Mail, User, ArrowRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      
      // Demo signup - simulate a brief loading state
      setTimeout(() => {
        // Store demo user data in localStorage to simulate authentication
        const demoUser = {
          uid: "demo-user-" + Date.now(),
          email: email,
          displayName: username
        };
        
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        
        toast.success("Demo account created successfully!");
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">VocabNest</h1>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
          <p className="text-center text-muted-foreground mb-4">
            Demo mode: Enter any details to sign up
          </p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 py-2.5 px-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-2.5 px-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-2.5 px-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 py-2.5 px-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="bg-primary/5 p-3 rounded-md border border-primary/10 flex items-start">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Create your account to access our AI vocabulary assistant that helps you learn and practice new words!
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex justify-center items-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up (Demo)"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center">
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
