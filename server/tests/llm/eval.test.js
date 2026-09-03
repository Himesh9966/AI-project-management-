require('dotenv').config();
const { getPlannerPrompt } = require('../../prompts/projectPlannerPrompt');
const { getProblemModelingPrompt } = require('../../prompts/problemModelingPrompt');
const aiService = require('../../services/aiService');

// We extend timeout because LLM calls can take 5-15 seconds
jest.setTimeout(30000);

describe('LLM Evaluation Tests', () => {
  beforeAll(() => {
    // We check if the real API key is present. If it's the mock dev key, we might skip or fail.
    if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'mock_dev_key') {
      console.warn('Skipping LLM eval tests because LLM_API_KEY is not configured with a real key.');
    }
  });

  test('Planner Prompt generates correctly structured JSON', async () => {
    if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'mock_dev_key') return;

    const idea = 'A simple todo list app';
    const prompt = getPlannerPrompt(idea);
    const response = await aiService.generateStructuredJSON(prompt);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('projectTitle');
    expect(response).toHaveProperty('summary');
    expect(response).toHaveProperty('techStack');
    expect(Array.isArray(response.techStack)).toBe(true);
    expect(response).toHaveProperty('tasks');
    expect(Array.isArray(response.tasks)).toBe(true);
    if (response.tasks.length > 0) {
      expect(response.tasks[0]).toHaveProperty('title');
      expect(response.tasks[0]).toHaveProperty('description');
      expect(response.tasks[0]).toHaveProperty('priority');
    }
  });

  test('Problem Modeling Prompt generates correctly structured JSON', async () => {
    if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'mock_dev_key') return;

    const idea = 'A ride sharing system with riders and drivers';
    const prompt = getProblemModelingPrompt(idea);
    const response = await aiService.generateStructuredJSON(prompt);

    expect(response).toBeDefined();
    expect(response).toHaveProperty('title');
    
    expect(response).toHaveProperty('actors');
    expect(Array.isArray(response.actors)).toBe(true);
    if (response.actors.length > 0) {
      expect(response.actors[0]).toHaveProperty('name');
      expect(response.actors[0]).toHaveProperty('description');
    }

    expect(response).toHaveProperty('entities');
    expect(Array.isArray(response.entities)).toBe(true);
    if (response.entities.length > 0) {
      expect(response.entities[0]).toHaveProperty('name');
      expect(Array.isArray(response.entities[0].attributes)).toBe(true);
    }
  });
});
