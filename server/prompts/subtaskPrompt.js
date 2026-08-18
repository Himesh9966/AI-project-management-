/**
 * CONCEPTS USED:
 * - Prompt Engineering
 * - Structured Output (JSON)
 *
 * PURPOSE:
 * Holds the prompt for breaking down a single complex task into smaller actionable subtasks.
 */

const getSubtaskPrompt = (taskTitle, taskDescription) => {
  return `You are an AI engineering mentor. A student is working on the following task:
Title: "${taskTitle}"
Description: "${taskDescription || 'No description provided.'}"

Please break this task down into 3-5 logical subtasks.

Output requirements:
Return ONLY a valid JSON object with the following exact structure. Do not include markdown formatting or backticks around the JSON.

{
  "subtasks": [
    {
      "title": "Subtask title (e.g. Create database schema)",
      "estimatedHours": 1
    }
  ]
}`;
};

module.exports = { getSubtaskPrompt };
