// JavaScript — Closures
// Demonstrating an inner function capturing a variable from its outer lexical scope.

export function createClosureCounter() {
  let count = 0; // count is captured by the inner function
  return function increment() {
    count++;
    return count;
  };
}
