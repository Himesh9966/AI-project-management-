// JavaScript — Promises vs callbacks
// Demonstrating the legacy callback pattern versus the modern Promise pattern.

export function withCallback(callback) {
  setTimeout(() => {
    callback("Data fetched using callbacks");
  }, 100);
}

export function withPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched using Promises");
    }, 100);
  });
}
