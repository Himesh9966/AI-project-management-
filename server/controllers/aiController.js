/**
 * CONCEPTS USED:
 * - Express Controller
 * - Separation of Concerns (Prompt, Service, DB)
 *
 * PURPOSE:
 * Exposes AI functional endpoints (Planner, Mentor, Subtasks) to the React client.
 */

const aiService = require('../services/aiService');
const AIPlan = require('../models/AIPlan');
const AIConversation = require('../models/AIConversation');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { getPlannerPrompt } = require('../prompts/projectPlannerPrompt');
const { getMentorContext } = require('../prompts/mentorPrompt');
const { getSubtaskPrompt } = require('../prompts/subtaskPrompt');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * @route   POST /api/ai/plan
 * @desc    Generate a structured MVP plan from an idea
 */
const generatePlan = async (req, res, next) => {
  try {
    const { projectIdea } = req.body;
    if (!projectIdea) {
      return sendError(res, 400, 'Project idea is required.');
    }

    const prompt = getPlannerPrompt(projectIdea);
    
    // Call LLM Service
    const generatedPlan = await aiService.generateStructuredJSON(prompt);

    // Save to DB
    const plan = new AIPlan({
      projectIdea,
      generatedPlan,
      createdBy: req.user.id
    });
    await plan.save();

    return sendSuccess(res, 201, 'AI Plan generated successfully', { plan });
  } catch (error) {
    if (error.message.includes('LLM_API_KEY')) {
      return sendError(res, 503, 'AI features are currently unavailable. Please check backend API keys.');
    }
    next(error);
  }
};

/**
 * @route   POST /api/ai/subtasks
 * @desc    Break down a task into subtasks
 */
const generateSubtasks = async (req, res, next) => {
  try {
    const { taskId, taskDescription } = req.body;
    if (!taskId) return sendError(res, 400, 'Task title/ID is required.');

    const prompt = getSubtaskPrompt(taskId, taskDescription);
    const subtasks = await aiService.generateStructuredJSON(prompt);

    return sendSuccess(res, 200, 'Subtasks generated successfully', subtasks); // subtasks contains { subtasks: [...] }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/mentor
 * @desc    Chat with the AI Mentor regarding a specific project
 */
const askMentor = async (req, res, next) => {
  try {
    const { projectId, message } = req.body;
    if (!projectId || !message) {
      return sendError(res, 400, 'Project ID and message are required.');
    }

    // 1. Gather Project Context
    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) return sendError(res, 404, 'Project not found');
    const tasks = await Task.find({ project: projectId });

    // 2. Build Context Prompt
    const systemContext = getMentorContext(project, tasks);

    // 3. Get or Create Conversation Log
    let conversation = await AIConversation.findOne({ project: projectId, user: req.user.id });
    if (!conversation) {
      conversation = new AIConversation({
        project: projectId,
        user: req.user.id,
        messages: [],
        contextSnapshot: {
          projectTitle: project.title,
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
          progress: project.progress
        }
      });
    }

    // Add user message to log
    conversation.messages.push({ role: 'user', content: message });
    
    // Fetch last 10 messages for context limit
    const recentMessages = conversation.messages.slice(-10);

    // 4. Send to LLM
    const mentorReply = await aiService.generateChatMessage(systemContext, recentMessages, message);

    // Add mentor reply to log and save
    conversation.messages.push({ role: 'model', content: mentorReply });
    await conversation.save();

    return sendSuccess(res, 200, 'Mentor responded', { reply: mentorReply, conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ai/plans
 * @desc    Get user's generated AI plans
 */
const getSavedPlans = async (req, res, next) => {
  try {
    const plans = await AIPlan.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Plans retrieved', { plans });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePlan,
  generateSubtasks,
  askMentor,
  getSavedPlans
};
