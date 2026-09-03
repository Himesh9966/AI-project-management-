/**
 * ============================================================
 * CONCEPT: JavaScript — Hoisting (0.1 pts • Frontend)
 * ============================================================
 *
 * WHAT IS HOISTING?
 *   Hoisting is JavaScript's default behavior of moving DECLARATIONS
 *   (not initializations) to the top of their scope during the
 *   compilation phase, before the code is actually executed.
 *
 * HOW IT WORKS:
 *   1. FUNCTION DECLARATIONS are fully hoisted — you can call them
 *      before they appear in the code.
 *   2. `var` declarations are hoisted but their VALUE is not — they are
 *      initialized to `undefined` until the assignment line runs.
 *   3. `let` and `const` are hoisted but placed in a "Temporal Dead Zone" (TDZ)
 *      — accessing them before declaration throws a ReferenceError.
 *
 * WHY IS IT IMPORTANT?
 *   - Explains why function declarations can be called before their definition.
 *   - Explains why `var` gives `undefined` instead of ReferenceError.
 *   - Explains why `let`/`const` are preferred (they prevent subtle bugs).
 *
 * WHERE IS THIS USED IN OUR PROJECT?
 *   - client/src/App.jsx → testHoisting() is called BEFORE its declaration
 *   - server/controllers/*.js → Function declarations used throughout
 *
 * VIVA QUESTIONS:
 *   Q1: What is hoisting?
 *   A1: Hoisting is the process where JavaScript moves declarations to the top
 *       of their scope during compilation. Function declarations are fully hoisted;
 *       var variables are hoisted but set to undefined; let/const are hoisted but
 *       kept in the Temporal Dead Zone.
 *
 *   Q2: What is the Temporal Dead Zone (TDZ)?
 *   A2: The TDZ is the period between entering a scope and the let/const declaration
 *       being reached. Accessing the variable during TDZ throws a ReferenceError.
 *
 *   Q3: What is the difference between hoisting of `var`, `let`, and function declarations?
 *   A3: Function declarations → fully hoisted (can call before definition).
 *       var → declaration hoisted, value is `undefined` until assignment.
 *       let/const → hoisted into TDZ, cannot access before declaration line.
 */

// --------------- DEMONSTRATION ---------------

// ✅ Example 1: Function Declaration Hoisting
// We call hoistedFunction() BEFORE it is defined — this works because
// function declarations are fully hoisted by the JavaScript engine.
export function triggerHoisting() {
  const result = hoistedFunction(); // Called BEFORE it appears in source code
  console.log("Hoisted function returned:", result);
  return result;
}

// This function is called on line 54, but defined here on line 60.
// JavaScript hoists this entire declaration to the top of the scope.
function hoistedFunction() {
  var hoistedVar = "I am hoisted to the top of my scope";
  return hoistedVar;
}

// ❌ Example 2: var hoisting — declaration hoisted, value is undefined
export function demonstrateVarHoisting() {
  console.log(x); // Output: undefined (NOT a ReferenceError!)
  var x = 10;     // Only the declaration `var x` is hoisted, not `= 10`
  console.log(x); // Output: 10
  return x;
}

// The above is interpreted by the engine as:
// var x;              ← hoisted declaration
// console.log(x);     ← undefined
// x = 10;             ← assignment stays in place
// console.log(x);     ← 10

// ❌ Example 3: let/const — Temporal Dead Zone
// Uncommenting the line below would throw: ReferenceError: Cannot access 'y' before initialization
// export function demonstrateLetTDZ() {
//   console.log(y);  // ReferenceError — y is in the Temporal Dead Zone
//   let y = 20;
// }
