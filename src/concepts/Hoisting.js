// JavaScript — Hoisting
// Demonstrating hoisting by calling a function before it is physically defined in the file.

export function triggerHoisting() {
  return hoistedFunction();
}

function hoistedFunction() {
  var hoistedVar = "I am hoisted to the top of my scope";
  return hoistedVar;
}
