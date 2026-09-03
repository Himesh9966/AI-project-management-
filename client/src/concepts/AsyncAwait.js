/**
 * ============================================================
 * CONCEPT: JavaScript — async/await (0.1 pts • Frontend)
 * ============================================================
 *
 * WHAT IS async/await?
 *   async/await is syntactic sugar built on top of Promises.
 *   It allows us to write asynchronous code that LOOKS synchronous,
 *   making it much easier to read and reason about.
 *
 * HOW IT WORKS:
 *   1. The `async` keyword before a function makes it always return a Promise.
 *   2. The `await` keyword pauses execution INSIDE the async function
 *      until the Promise it is waiting for resolves or rejects.
 *   3. Under the hood, the JavaScript engine uses the Event Loop to
 *      suspend the function and resume it when the awaited Promise settles.
 *
 * WHY USE IT?
 *   - Avoids "callback hell" (deeply nested callbacks).
 *   - Avoids long `.then()` chains with Promises.
 *   - Makes error handling clean with standard try/catch blocks.
 *
 * WHERE IS THIS USED IN OUR PROJECT?
 *   - client/src/hooks/useProjects.js  → fetchProjects() uses await api.getProjects()
 *   - client/src/context/AuthContext.jsx → login/register use await loginUser()/registerUser()
 *   - server/controllers/*.js → Every controller uses async/await for DB operations
 *   - server/services/aiService.js → await openai.chat.completions.create()
 *
 * VIVA QUESTIONS:
 *   Q1: What does `async` do to a function?
 *   A1: It makes the function always return a Promise. Even if you return a plain
 *       value, it gets wrapped in Promise.resolve().
 *
 *   Q2: What happens if you don't use `await` before a Promise inside an async function?
 *   A2: The Promise runs but the function doesn't wait for it to complete.
 *       You get a pending Promise object instead of the resolved value.
 *
 *   Q3: How do you handle errors with async/await?
 *   A3: Using try/catch blocks, just like synchronous code.
 *
 *   Q4: Can you use await outside of an async function?
 *   A4: Only in ES Modules (top-level await). In CommonJS modules, you cannot.
 */

// --------------- DEMONSTRATION ---------------

// Simulates a network request that takes 200ms
function simulateAPICall(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data });
    }, 200);
  });
}

// ✅ Using async/await — clean, readable, synchronous-looking code
export async function fetchUserData() {
  try {
    // `await` pauses here until the Promise resolves
    const response = await simulateAPICall({ name: 'Himesh', role: 'Student' });
    console.log('User data received:', response.data);
    return response.data;
  } catch (error) {
    // Errors from rejected Promises are caught here
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// ✅ Sequential vs Parallel async calls
export async function fetchMultipleResources() {
  // SEQUENTIAL — second call waits for first to finish
  const user = await simulateAPICall({ id: 1, name: 'Himesh' });
  const projects = await simulateAPICall({ userId: 1, count: 5 });

  // PARALLEL — both calls start at the same time using Promise.all
  const [tasks, notifications] = await Promise.all([
    simulateAPICall({ tasks: ['Task 1', 'Task 2'] }),
    simulateAPICall({ unread: 3 })
  ]);

  return { user, projects, tasks, notifications };
}
