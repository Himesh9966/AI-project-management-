/**
 * CONCEPTS DEMONSTRATION FILE
 * This file explicitly demonstrates key JavaScript concepts for frontend evaluation.
 */

// 1. JavaScript — Hoisting
// Hoisting allows us to call this function before it is defined in the code.
// The function declaration is hoisted to the top of the scope.
demoHoisting();

function demoHoisting() {
  var hoistedVar = "I am hoisted";
  return hoistedVar;
}

// 2. JavaScript — Closures
// A closure is formed when the inner function retains access to the outer function's scope.
export const createCounter = () => {
  let count = 0; // count is captured by the closure
  return function increment() {
    count++;
    return count;
  };
};

// 3. JavaScript — Promises vs callbacks
// Callback approach (older pattern)
export const fetchDataCallback = (url, callback) => {
  // 4. JavaScript — Event loop
  // setTimeout pushes the execution to the event loop's task queue, making it non-blocking.
  setTimeout(() => {
    if (!url) {
      callback(new Error("URL required"));
    } else {
      callback(null, `Data from ${url} via Callback`);
    }
  }, 50);
};

// Promise approach (modern pattern, avoids callback hell)
export const fetchDataPromise = (url) => {
  return new Promise((resolve, reject) => {
    // Event loop usage
    setTimeout(() => {
      if (!url) {
        reject(new Error("URL required"));
      } else {
        resolve(`Data from ${url} via Promise`);
      }
    }, 50);
  });
};

// 5. JavaScript — async/await
// Syntactic sugar over Promises for cleaner, synchronous-looking asynchronous code.
export const fetchAllDataAsync = async (url) => {
  try {
    const data = await fetchDataPromise(url);
    return data;
  } catch (error) {
    console.error("Async/Await Error:", error);
    throw error;
  }
};
