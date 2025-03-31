
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'sonner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for demo user in localStorage
  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser');
    
    if (demoUser) {
      setCurrentUser(JSON.parse(demoUser));
      setLoading(false);
    } else {
      // Firebase auth state listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      
      return unsubscribe;
    }
  }, []);

  async function signup(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name
      await updateProfile(userCredential.user, { displayName: username });
      toast.success("Account created successfully");
      return userCredential.user;
    } catch (error) {
      toast.error(`Signup failed: ${error.message}`);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      // Check if it's a demo login attempt
      const demoUser = localStorage.getItem('demoUser');
      
      if (demoUser) {
        const parsedUser = JSON.parse(demoUser);
        if (parsedUser.email === email) {
          setCurrentUser(parsedUser);
          toast.success("Demo login successful!");
          return { user: parsedUser };
        }
      }
      
      // Regular Firebase login
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back to VocabNest!");
      return result;
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async function logout() {
    try {
      // Check if we're in demo mode
      if (localStorage.getItem('demoUser')) {
        localStorage.removeItem('demoUser');
        setCurrentUser(null);
        toast.success("Demo user logged out successfully");
        return;
      }
      
      // Regular Firebase logout
      await signOut(auth);
      toast.success("You have been successfully logged out");
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      // In demo mode, just show a success message
      if (localStorage.getItem('demoUser')) {
        toast.success("Demo: Password reset email would be sent");
        return;
      }
      
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(`Reset password failed: ${error.message}`);
      throw error;
    }
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
