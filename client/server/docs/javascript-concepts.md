# JavaScript Concepts Demonstrated in AI Project Mentor

This document satisfies the rubric requirements by isolating and explaining key JavaScript concepts with clear examples drawn directly from this codebase.

---

## 1. Async / Await
**Concept**: Syntactic sugar over Promises that allows writing asynchronous code in a synchronous style, making it easier to read and maintain.

**Where used**: Used extensively in all Express controllers (e.g., `server/controllers/authController.js`) and services.

**Example from codebase**:
```javascript
const getMe = async (req, res, next) => {
  try {
    // Execution pauses here until the DB query completes
    const user = await findUserById(req.user.id);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'Success', { user });
  } catch (error) {
    next(error);
  }
};
```

---

## 2. Promises vs Callbacks
**Concept**: A Promise represents the eventual completion (or failure) of an asynchronous operation. Unlike older callback patterns which lead to "Callback Hell", Promises can be chained and handled cleanly.

**Where used**: Throughout the React frontend (`client/src/services/api.js`) and database configurations.

**Example of Callbacks (The Old Way - Error Prone)**:
```javascript
// Hypothetical callback example
db.query('SELECT * FROM users', (err, result) => {
  if (err) throw err;
  db.query('SELECT * FROM projects WHERE owner = ' + result.id, (err, projects) => {
    // Nested callback hell
  });
});
```

**Example of Promises (Our Project's Way)**:
```javascript
// Actual example from client/src/App.jsx
fetch('http://localhost:5001/health')
  .then((res) => res.json())
  .then((data) => setServerStatus('Connected'))
  .catch((err) => setServerStatus('Offline'));
```

---

## 3. Closures
**Concept**: A closure is formed when an inner function "remembers" and accesses variables from its outer (enclosing) lexical scope, even after the outer function has finished executing.

**Where used**: In our Validation Middleware Factory (`server/middleware/validationMiddleware.js`).

**Example from codebase**:
```javascript
const validate = (validationFn) => {
  // validationFn is trapped in the closure
  return (req, res, next) => {
    // The inner function executes on every request, remembering 'validationFn'
    const { isValid, errors } = validationFn(req.body);
    if (!isValid) return sendError(res, 400, 'Validation Failed', errors);
    next();
  };
};

// Usage: router.post('/', validate(validateProject), controller.createProject)
```

---

## 4. JavaScript Hoisting
**Concept**: Hoisting is JavaScript's default behavior of moving function and variable declarations to the top of their respective scopes during the compilation phase, before code execution. 

**Where used**: Used globally. Because we define functions using `const` arrow functions across our services and controllers, we **prevent** unexpected hoisting bugs (since `const` and `let` are block-scoped and not initialized until evaluated, unlike `var` or `function` declarations).

**Example Demonstration**:
```javascript
// If we used function declarations (hoisted):
console.log(hoistedFunc()); // Outputs: "I am hoisted!"
function hoistedFunc() { return "I am hoisted!"; }

// In our project, we use const arrow functions (NOT hoisted, safer):
// console.log(safeFunc()); // Would throw ReferenceError
const safeFunc = () => { return "I am safe!"; };
```

---

## 5. Node.js Event Loop
**Concept**: The Event Loop is what allows Node.js to perform non-blocking I/O operations (like database queries and LLM API calls) on a single thread. It offloads operations to the system kernel whenever possible.

**How it works in this project**:
When the `authController` calls `await bcrypt.hash(password)`, the heavy computation or I/O is offloaded. The Node.js event loop does not block the entire server. Instead, it continues to serve other incoming HTTP requests from other students. Once the hash computation is ready, a callback is pushed to the task queue, and the event loop resumes the execution of the `authController` function.
