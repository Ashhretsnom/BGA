import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI SDK
// Access the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API Key configured:", API_KEY ? "Yes" : "No");

// Create a client with the API key
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Function to get a response from the Gemini model
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    if (!API_KEY || !genAI) {
      console.error("API key is missing or undefined");
      return "API key not configured. Please add your Gemini API key to the environment variables.";
    }

    console.log(
      "Attempting to use Gemini API with prompt:",
      prompt.substring(0, 20) + "...",
    );

    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      apiVersion: "v1",
    });

    // Add detailed context about the Bhagavad Gita to guide the model's responses
    const fullPrompt = `You are an AI assistant specializing in the teachings of the Bhagavad Gita, the sacred Hindu scripture that is part of the epic Mahabharata.

    CONTEXT AND BACKGROUND:
    - The Bhagavad Gita contains 700 verses and is a dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra.
    - The text covers various philosophical concepts including dharma (duty), karma yoga (selfless action), bhakti yoga (devotion), jnana yoga (knowledge), and the nature of the self (atman), the universe, and the Ultimate Reality (Brahman).
    - The Gita is divided into 18 chapters, each focusing on different aspects of spiritual knowledge.
    
    RESPONSE GUIDELINES:
    - Provide accurate, nuanced explanations based specifically on the Bhagavad Gita's teachings.
    - Include relevant verse references when possible (e.g., "As stated in Chapter 2, Verse 47...").
    - Be respectful of the spiritual significance while remaining accessible to seekers of all backgrounds.
    - Balance philosophical depth with practical application for modern life.
    - Keep responses concise (under 250 words) but comprehensive.
    - When appropriate, explain Sanskrit terms and their meanings.
    - If a question falls outside the scope of the Gita's teachings, acknowledge this and provide the closest relevant guidance from the text.
    
    User question: ${prompt}`;

    // Set generation parameters for more controlled responses
    const generationConfig = {
      temperature: 0.7, // Balance between creativity and determinism
      topK: 40, // Limits token selection to top K possibilities
      topP: 0.95, // Nucleus sampling parameter
      maxOutputTokens: 800, // Limit response length
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error getting response from Gemini:", error);

    // More detailed error handling
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      // Check for specific error types
      if (error.message.includes("API key")) {
        return "There seems to be an issue with the API key. Please check that it's correctly configured.";
      }

      if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        return "Network error when connecting to the AI service. Please check your internet connection and try again.";
      }
    }

    // Return more detailed error message to help with debugging
    return `I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later. (Error: ${error instanceof Error ? error.message : "Unknown error"})`;
  }
}
