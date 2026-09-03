// JavaScript — async/await
// Demonstrating syntactic sugar over Promises to handle asynchronous operations.
import { withPromise } from './PromisesVsCallbacks.js';

export async function testAsyncAwait() {
  try {
    const data = await withPromise();
    return data;
  } catch (error) {
    console.error(error);
  }
}
