/**
 * ============================================================
 * CONCEPT: JavaScript — Promises vs Callbacks (0.1 pts • Frontend)
 * ============================================================
 *
 * WHAT ARE CALLBACKS?
 *   A callback is a function passed as an argument to another function,
 *   to be "called back" at a later time when an asynchronous operation completes.
 *   This was the original way JavaScript handled async operations.
 *
 * WHAT ARE PROMISES?
 *   A Promise is an object representing the eventual completion (or failure)
 *   of an asynchronous operation. It has three states:
 *     - PENDING: initial state, neither fulfilled nor rejected
 *     - FULFILLED (resolved): operation completed successfully
 *     - REJECTED: operation failed
 *
 * WHY PROMISES ARE BETTER THAN CALLBACKS:
 *   1. READABILITY — Avoids "callback hell" / "pyramid of doom"
 *   2. ERROR HANDLING — .catch() handles all errors in the chain vs
 *      checking `err` in every callback
 *   3. CHAINING — .then().then() allows sequential async operations
 *   4. COMPOSITION — Promise.all(), Promise.race() for parallel operations
 *
 * WHERE IS THIS USED IN OUR PROJECT?
 *   - client/src/services/api.js → Every API call returns a Promise (axios)
 *   - server/services/aiService.js → LLM API calls return Promises
 *   - server/config/mongodb.js → mongoose.connect() returns a Promise
 *
 * VIVA QUESTIONS:
 *   Q1: What is "callback hell" and how do Promises solve it?
 *   A1: Callback hell is deeply nested callbacks making code unreadable.
 *       Promises solve it with .then() chaining and async/await syntax.
 *
 *   Q2: What are the three states of a Promise?
 *   A2: Pending, Fulfilled (resolved), and Rejected.
 *
 *   Q3: What is Promise.all() and when would you use it?
 *   A3: Promise.all() takes an array of Promises and resolves when ALL of them
 *       resolve. If any one rejects, the entire Promise.all rejects. Use it
 *       when you need to run multiple independent async operations in parallel.
 */

// --------------- DEMONSTRATION ---------------

// ❌ THE OLD WAY: Callbacks — leads to "callback hell" with nesting
export function withCallback(callback) {
  setTimeout(() => {
    callback(null, "Data fetched using callbacks");
  }, 100);
}

// Usage (notice the nesting — this gets ugly fast):
// withCallback((err, data1) => {
//   withCallback((err, data2) => {
//     withCallback((err, data3) => {
//       console.log(data3); // 3 levels deep — "Callback Hell"
//     });
//   });
// });

// ✅ THE MODERN WAY: Promises — flat, chainable, composable
export function withPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched using Promises");
    }, 100);
  });
}

// Usage with .then() chaining (flat, not nested):
// withPromise()
//   .then(data1 => withPromise())
//   .then(data2 => withPromise())
//   .then(data3 => console.log(data3))
//   .catch(err => console.error(err));

// ✅ ERROR HANDLING COMPARISON:

// Callback error handling — must check `err` in EVERY callback
export function callbackWithError(callback) {
  setTimeout(() => {
    const error = Math.random() > 0.5 ? new Error("Something went wrong") : null;
    callback(error, error ? null : "Success");
  }, 100);
}

// Promise error handling — single .catch() handles all errors in the chain
export function promiseWithError() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        reject(new Error("Something went wrong"));
      } else {
        resolve("Success");
      }
    }, 100);
  });
}

// ✅ PROMISE COMPOSITION — running multiple operations in parallel
export function fetchAllDataInParallel() {
  return Promise.all([
    withPromise(),
    withPromise(),
    withPromise()
  ]);
  // Resolves with an array of all results: ["Data...", "Data...", "Data..."]
}
