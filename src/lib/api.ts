const API_BASE_URL = 'https://classgpt.onrender.com';

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate study material with retry logic
export const generateStudyMaterial = async (topic: string, type: string, retries = 2) => {
  console.log(`Attempting to generate study material for topic: ${topic}, type: ${type}`);
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${retries + 1}`);
      
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, type }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`HTTP error! status: ${response.status}`, errorData);
        
        // If it's a server error and we have retries left, wait and try again
        if (response.status >= 500 && attempt <= retries) {
          console.log(`Server error, waiting ${attempt * 2} seconds before retry...`);
          await delay(attempt * 2000); // Progressive delay
          continue;
        }
        
        // Throw a more descriptive error
        throw new Error(
          errorData.message || 
          `Server error (${response.status}). The AI service is currently experiencing issues. Please try again in a few moments.`
        );
      }

      const data = await response.json();
      console.log('Generation successful:', data);
      return data;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      // If we've exhausted all retries, throw the error
      if (attempt > retries) {
        if (error instanceof Error && error.message.includes('fetch')) {
          throw new Error('Unable to connect to the AI service. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      // Wait before retrying on network errors
      if (attempt <= retries) {
        console.log(`Network error, waiting ${attempt * 2} seconds before retry...`);
        await delay(attempt * 2000);
      }
    }
  }
};

// Fetch all topics
export const fetchTopics = async () => {
  const response = await fetch(`${API_BASE_URL}/topics`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Fetch topic by ID
export const fetchTopicById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/topics/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Delete topic
export const deleteTopic = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/topics/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Export topic with content type
export const exportTopic = async (topicId: string, format: string, contentType: string) => {
  const response = await fetch(`${API_BASE_URL}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topicId, format, contentType }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // For file downloads, we return the response text/blob
  if (format === 'pdf') {
    return response.blob();
  }
  
  return response.text();
};
