
const STORAGE_KEY = 'vocabnest_saved_words';

const getSavedWords = () => {
  const savedWords = localStorage.getItem(STORAGE_KEY);
  return savedWords ? JSON.parse(savedWords) : [];
};

const saveWord = (wordData) => {
  const savedWords = getSavedWords();
  
  // Check if word already exists
  const exists = savedWords.some(item => item.word.toLowerCase() === wordData.word.toLowerCase());
  
  if (!exists) {
    const updatedWords = [...savedWords, wordData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
    return updatedWords;
  }
  
  return savedWords;
};

const removeWord = (word) => {
  const savedWords = getSavedWords();
  const updatedWords = savedWords.filter(item => item.word.toLowerCase() !== word.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  return updatedWords;
};

export { getSavedWords, saveWord, removeWord };
