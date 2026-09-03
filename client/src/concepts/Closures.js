/**
 * ============================================================
 * CONCEPT: JavaScript — Closures (0.1 pts • Frontend)
 * ============================================================
 *
 * WHAT IS A CLOSURE?
 *   A closure is a function that "remembers" the variables from its
 *   outer (enclosing) lexical scope, even after the outer function
 *   has finished executing.
 *
 * HOW IT WORKS:
 *   1. When a function is defined inside another function, the inner
 *      function gets a reference to the outer function's variable environment.
 *   2. Even after the outer function returns, the inner function retains
 *      access to those variables — they are NOT garbage collected.
 *   3. This is possible because JavaScript uses lexical scoping — a
 *      function's scope is determined by WHERE it is defined, not where
 *      it is called.
 *
 * WHY IS IT USEFUL?
 *   - Data privacy / encapsulation (private variables).
 *   - Factory functions (create specialized functions).
 *   - Middleware patterns (Express middleware uses closures).
 *   - React hooks (useState, useEffect are closures under the hood).
 *
 * WHERE IS THIS USED IN OUR PROJECT?
 *   - server/middleware/validationMiddleware.js → validate(validationFn) returns
 *     a middleware that "closes over" validationFn from the outer scope.
 *   - client/src/hooks/useProjects.js → fetchProjects closes over setProjects,
 *     setLoading, and setError from the hook's scope.
 *   - client/src/context/AuthContext.jsx → login() closes over setUser.
 *
 * VIVA QUESTIONS:
 *   Q1: What is a closure?
 *   A1: A closure is a function bundled with its lexical environment. It retains
 *       access to variables from the scope where it was created.
 *
 *   Q2: Give a real-world example of closures in your project.
 *   A2: The validate() middleware factory. It takes a validationFn parameter and
 *       returns a new middleware function. That returned function "closes over"
 *       validationFn and uses it every time a request comes in.
 *
 *   Q3: How are closures related to garbage collection?
 *   A3: Variables captured by a closure are NOT garbage collected even after the
 *       outer function returns, because the closure still holds a reference to them.
 */

// --------------- DEMONSTRATION ---------------

// Example 1: Basic counter closure — `count` is a PRIVATE variable
export function createClosureCounter() {
  let count = 0; // This variable is "enclosed" / "captured"

  return function increment() {
    count++;          // The inner function accesses `count` from outer scope
    return count;     // Even though createClosureCounter() has already returned
  };
}

// Usage:
// const counter = createClosureCounter();
// counter(); → 1
// counter(); → 2
// counter(); → 3
// `count` is not accessible from outside — it is PRIVATE.

// Example 2: Closure as a function factory — creating specialized greeting functions
export function createGreeter(greeting) {
  // `greeting` is captured by the inner function
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

// Usage:
// const hello = createGreeter("Hello");
// const namaste = createGreeter("Namaste");
// hello("Himesh")   → "Hello, Himesh!"
// namaste("Himesh") → "Namaste, Himesh!"

// Example 3: Middleware-style closure (mirrors our validation middleware pattern)
export function createValidator(validationRule) {
  // Returns a function that "closes over" validationRule
  return function (data) {
    return validationRule(data);
  };
}
