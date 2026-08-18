/**
 * CONCEPTS USED:
 * - 3rd Party API Integration (LLM)
 * - Structured Output Parsing
 * - Asynchronous Promises
 * - Centralized AI Gateway
 *
 * PURPOSE:
 * Bridges the backend application with the external LLM API securely.
 *
 * RESPONSIBILITY:
 * Sends prompts to the Generative AI model, cleans and parses JSON responses,
 * and handles AI-specific rate limit or network errors.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize safely. If the key is dummy, it will throw when called, which is handled gracefully.
const getAIModel = () => {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey || apiKey === 'mock_dev_key') {
    throw new Error('Valid LLM_API_KEY is missing in environment variables.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: process.env.LLM_MODEL || 'gemini-1.5-flash' });
};

/**
 * Strips markdown formatting (like ```json ... ```) from LLM output
 */
const cleanJSONResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

/**
 * Call the AI model and expect a JSON string
 */
const generateStructuredJSON = async (prompt) => {
  const model = getAIModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  try {
    const cleaned = cleanJSONResponse(text);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse AI output as JSON:', text);
    throw new Error('AI returned an invalid response format.');
  }
};

/**
 * Send a contextual chat message to the AI
 */
const generateChatMessage = async (systemContext, previousMessages, userMessage) => {
  const model = getAIModel();
  
  // Construct the chat history manually if needed, or pass as a single prompt
  // For simplicity in this MVP, we compile the context into a robust single prompt
  
  let chatLog = previousMessages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
  
  const fullPrompt = `
${systemContext}

--- PREVIOUS CONVERSATION HISTORY ---
${chatLog}
-------------------------------------

USER: ${userMessage}
MENTOR:`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
};

module.exports = {
  generateStructuredJSON,
  generateChatMessage
};
