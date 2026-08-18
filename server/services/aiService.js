/**
 * CONCEPTS USED:
 * - 3rd Party API Integration (OpenRouter / OpenAI SDK)
 * - Structured Output Parsing
 * - Asynchronous Promises
 * - Centralized AI Gateway
 *
 * PURPOSE:
 * Bridges the backend application with the OpenRouter LLM API securely.
 *
 * RESPONSIBILITY:
 * Sends prompts to OpenRouter models, cleans and parses JSON responses,
 * and handles AI-specific rate limit or network errors.
 */

const { OpenAI } = require('openai');

// Initialize safely. If the key is dummy, it will throw when called, which is handled gracefully.
const getOpenAIClient = () => {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey || apiKey === 'mock_dev_key') {
    throw new Error('Valid LLM_API_KEY is missing in environment variables.');
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey
  });
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
  const openai = getOpenAIClient();
  const model = process.env.LLM_MODEL || 'meta-llama/llama-3.1-8b-instruct';
  
  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const text = response.choices[0].message.content;
  
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
  const openai = getOpenAIClient();
  const model = process.env.LLM_MODEL || 'meta-llama/llama-3.1-8b-instruct';
  
  // Construct the messages array required by OpenAI/OpenRouter APIs
  const messages = [
    { role: 'system', content: systemContext },
    ...previousMessages.map(msg => ({ 
      role: msg.role === 'model' ? 'assistant' : msg.role, 
      content: msg.content 
    })),
    { role: 'user', content: userMessage }
  ];

  const response = await openai.chat.completions.create({
    model: model,
    messages: messages
  });
  
  return response.choices[0].message.content;
};

module.exports = {
  generateStructuredJSON,
  generateChatMessage
};
