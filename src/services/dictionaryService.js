
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const fetchWordDefinition = async (word) => {
  try {
    const response = await fetch(`${API_URL}${word}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    
    // Format the response to get the information we need
    if (data && data.length > 0) {
      const result = data[0];
      const meanings = result.meanings[0];
      
      return {
        word: result.word,
        phonetic: result.phonetic || '',
        partOfSpeech: meanings.partOfSpeech || '',
        definition: meanings.definitions[0].definition || '',
        example: meanings.definitions[0].example || '',
      };
    }
    
    throw new Error('Failed to parse dictionary response');
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
};

export { fetchWordDefinition };
