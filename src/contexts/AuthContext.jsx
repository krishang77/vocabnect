
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
      await signOut(auth);
      toast.success("You have been successfully logged out");
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(`Reset password failed: ${error.message}`);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
