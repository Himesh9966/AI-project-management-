/**
 * ============================================================
 * CONCEPT: JavaScript — Event Loop (0.1 pts • Frontend)
 * ============================================================
 *
 * WHAT IS THE EVENT LOOP?
 *   JavaScript is single-threaded — it can only execute one piece of code at a time.
 *   The Event Loop is the mechanism that allows JavaScript to perform non-blocking
 *   asynchronous operations (like network requests, timers, file I/O) despite being
 *   single-threaded.
 *
 * HOW IT WORKS (The 4 components):
 *   1. CALL STACK — Where synchronous code executes (LIFO — Last In, First Out).
 *   2. WEB APIs / Node APIs — Browser/Node handles async operations (setTimeout,
 *      fetch, DOM events) in separate threads.
 *   3. CALLBACK QUEUE (Macro-task queue) — Holds callbacks from setTimeout, setInterval,
 *      I/O operations. Processed one at a time AFTER the call stack is empty.
 *   4. MICROTASK QUEUE — Holds callbacks from Promises (.then), async/await, queueMicrotask.
 *      Has HIGHER PRIORITY than the callback queue. All microtasks run before the next macro-task.
 *
 * EXECUTION ORDER:
 *   Call Stack → ALL Microtasks (Promises) → ONE Macro-task (setTimeout) → Repeat
 *
 * WHY IS IT IMPORTANT?
 *   - Understanding the event loop is crucial for debugging async behavior.
 *   - It explains why setTimeout(fn, 0) doesn't execute immediately.
 *   - It explains why Promises resolve before setTimeout callbacks.
 *
 * WHERE IS THIS USED IN OUR PROJECT?
 *   - client/src/hooks/useProjects.js → setTimeout used for non-blocking logging
 *   - All async/await calls rely on the event loop to schedule their continuations
 *   - Express.js request handling is entirely event-loop driven
 *
 * VIVA QUESTIONS:
 *   Q1: What is the event loop?
 *   A1: It's the mechanism that continuously checks if the call stack is empty,
 *       and if so, pushes callbacks from the microtask queue (Promises) and then
 *       the macro-task queue (setTimeout) onto the call stack for execution.
 *
 *   Q2: What is the difference between microtask and macro-task queue?
 *   A2: Microtasks (Promises, async/await) have higher priority. ALL microtasks
 *       execute before the event loop picks the next macro-task (setTimeout, setInterval).
 *
 *   Q3: What will be the output of the testEventLoop() function below?
 *   A3: "1: Synchronous — Call Stack" → "3: Microtask — Promise" → "2: Macro-task — setTimeout"
 */

// --------------- DEMONSTRATION ---------------

export function testEventLoop() {
  // Step 1: Synchronous code — goes directly onto the Call Stack
  console.log("1: Synchronous — Call Stack");

  // Step 2: setTimeout — callback is sent to the Macro-task Queue
  setTimeout(() => {
    console.log("2: Macro-task — setTimeout (runs LAST)");
  }, 0);

  // Step 3: Promise — .then() callback goes to the Microtask Queue
  Promise.resolve().then(() => {
    console.log("3: Microtask — Promise (runs BEFORE setTimeout)");
  });

  console.log("4: Synchronous — Still on Call Stack");
}

// Expected console output order:
// "1: Synchronous — Call Stack"
// "4: Synchronous — Still on Call Stack"
// "3: Microtask — Promise (runs BEFORE setTimeout)"
// "2: Macro-task — setTimeout (runs LAST)"
//
// This proves: Sync code → Microtasks → Macro-tasks
