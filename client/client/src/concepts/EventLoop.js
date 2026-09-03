// JavaScript — Event loop
// Demonstrating the event loop using setTimeout to push a non-blocking macro-task to the queue.

export function testEventLoop() {
  console.log("Event Loop Start");
  setTimeout(() => {
    console.log("Executed from the macro-task queue via Event Loop");
  }, 0);
  console.log("Event Loop End");
}
