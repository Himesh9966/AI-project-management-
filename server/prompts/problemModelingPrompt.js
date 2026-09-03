/**
 * Prompt for generating a problem model (data entities, constraints, actors) from a raw problem description.
 */

const getProblemModelingPrompt = (problemDescription) => {
  return `You are an expert Software Architect and Systems Designer.
Your task is to analyze the following problem description and output a structured Problem Model.

Problem Description:
"${problemDescription}"

Instructions:
1. Identify the core 'Actors' (users or systems that interact).
2. Identify the core 'Data Entities' (the main objects in the system).
3. Identify the 'Constraints' and 'Business Rules'.
4. Format your response strictly as a JSON object matching the exact structure below. Do not include markdown formatting like \`\`\`json or any conversational text.

{
  "title": "A concise, professional title for the modeled system",
  "actors": [
    {
      "name": "Actor name (e.g., Admin, User, Payment Gateway)",
      "description": "What they do in the system"
    }
  ],
  "entities": [
    {
      "name": "Entity Name (e.g., Order, Product)",
      "attributes": ["attribute1", "attribute2"],
      "relationships": ["Has many Products", "Belongs to User"]
    }
  ],
  "constraints": [
    "Rule 1",
    "Rule 2"
  ]
}
`;
};

module.exports = {
  getProblemModelingPrompt
};
