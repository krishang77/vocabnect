
import { toast } from 'sonner';

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const fetchWordDefinition = async (word) => {
  try {
    const response = await fetch(`${API_URL}${encodeURIComponent(word.trim())}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Word not found');
    }
    
    const data = await response.json();
    
    // Format the response to get the information we need
    if (data && data.length > 0) {
      const result = data[0];
      
      // Find the first meaning with a definition
      let foundMeaning = null;
      let foundDefinition = null;
      let foundExample = null;
      
      for (const meaning of result.meanings) {
        if (meaning.definitions && meaning.definitions.length > 0) {
          foundMeaning = meaning;
          foundDefinition = meaning.definitions[0].definition;
          foundExample = meaning.definitions[0].example || '';
          break;
        }
      }
      
      if (!foundMeaning || !foundDefinition) {
        throw new Error('No definition found for this word');
      }
      
      return {
        word: result.word,
        phonetic: result.phonetic || '',
        partOfSpeech: foundMeaning.partOfSpeech || '',
        definition: foundDefinition,
        example: foundExample,
      };
    }
    
    throw new Error('Failed to parse dictionary response');
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
};

// Get multiple word definitions at once (for batch processing)
const fetchMultipleWordDefinitions = async (words) => {
  const results = [];
  const errors = [];
  
  for (const word of words) {
    try {
      const definition = await fetchWordDefinition(word);
      results.push(definition);
    } catch (error) {
      errors.push({ word, error: error.message });
    }
  }
  
  if (errors.length > 0) {
    console.warn('Some words could not be fetched:', errors);
  }
  
  return results;
};

export { fetchWordDefinition, fetchMultipleWordDefinitions };
