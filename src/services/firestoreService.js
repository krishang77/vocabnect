
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get all saved words for a user
const getUserWords = async (userId) => {
  try {
    const wordsRef = collection(db, 'words');
    const q = query(wordsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const words = [];
    querySnapshot.forEach((doc) => {
      words.push({ id: doc.id, ...doc.data() });
    });
    
    return words;
  } catch (error) {
    console.error('Error getting user words:', error);
    throw error;
  }
};

// Save a new word to Firestore
const saveWordToFirestore = async (userId, wordData) => {
  try {
    const wordsRef = collection(db, 'words');
    const result = await addDoc(wordsRef, {
      ...wordData,
      userId,
      createdAt: serverTimestamp(),
      lastViewed: serverTimestamp()
    });
    
    return { id: result.id, ...wordData };
  } catch (error) {
    console.error('Error saving word:', error);
    throw error;
  }
};

// Delete a word from Firestore
const deleteWordFromFirestore = async (wordId) => {
  try {
    const wordRef = doc(db, 'words', wordId);
    await deleteDoc(wordRef);
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Update a word in Firestore
const updateWordInFirestore = async (wordId, data) => {
  try {
    const wordRef = doc(db, 'words', wordId);
    await updateDoc(wordRef, {
      ...data,
      lastViewed: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(wordRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
};

// Get user statistics
const getUserStats = async (userId) => {
  try {
    const words = await getUserWords(userId);
    
    return {
      totalWords: words.length,
      recentWords: words.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
      // Add more stats as needed
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

export {
  getUserWords,
  saveWordToFirestore,
  deleteWordFromFirestore,
  updateWordInFirestore,
  getUserStats
};
