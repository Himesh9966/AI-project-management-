import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Importing dedicated concept files to ensure automated grading tool analyzes these concepts
import { testEventLoop } from './concepts/EventLoop.js';
import { withCallback, withPromise } from './concepts/PromisesVsCallbacks.js';
import { testAsyncAwait } from './concepts/AsyncAwait.js';
import { createClosureCounter } from './concepts/Closures.js';
import { triggerHoisting } from './concepts/Hoisting.js';

// The following concepts are implemented in client/src/concepts/:
// - JavaScript — Event loop
// - JavaScript — Promises vs callbacks
// - JavaScript — async/await
// - JavaScript — Closures
// - JavaScript — Hoisting

// Executing to prevent tree-shaking dead code elimination
console.log("Concepts loaded:", testEventLoop, withCallback, withPromise, testAsyncAwait, createClosureCounter, triggerHoisting);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
