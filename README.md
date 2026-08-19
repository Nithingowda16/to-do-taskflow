# TaskFlow - Interactive To-Do List Application

TaskFlow is a modern, responsive, production-quality **To-Do List Web Application** built exclusively with **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. It offers seamless task management with zero external framework dependencies.

![TaskFlow Header](https://img.shields.gradient.is/TaskFlow-Productivity?style=flat-square)

---

## 📖 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)
- [Application Architecture & Workflow](#-application-architecture--workflow)
- [Key JavaScript Concepts Demonstrated](#-key-javascript-concepts-demonstrated)
- [Accessibility Compliance (a11y)](#-accessibility-compliance-a11y)
- [Security & Input Sanitation](#-security--input-sanitation)
- [Testing & Scenario Validation](#-testing--scenario-validation)
- [Future Improvements](#-future-improvements)

---

## ✨ Features

- **Add Tasks**: Effortlessly add new tasks with validation for empty or whitespace-only inputs.
- **Inline Editing**: Modify existing tasks inline without disruptive popups or page reloads.
- **Complete / Pending Toggle**: Mark tasks as completed or pending with instant visual feedback and stats sync.
- **Delete Tasks**: Remove individual tasks or bulk-clear all completed tasks.
- **Dynamic Task Statistics**: Real-time counter dashboard displaying **Total**, **Pending**, and **Completed** tasks.
- **Filter Tabs**: Filter task views by **All**, **Pending**, or **Completed**.
- **Empty State**: Friendly graphic and messages displayed dynamically when no tasks are present.
- **LocalStorage Persistence**: Task list automatically persists across page refreshes and browser sessions.
- **Fully Responsive**: Optimized layout across mobile (320px+), tablet, and desktop screens.
- **Accessible (a11y)**: Built with semantic HTML5 elements, explicit labels, ARIA live regions, and visual focus outlines for keyboard navigation.

---

## 🛠 Technologies Used

- **HTML5**: Semantic markup (`<header>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<label>`, `<button>`, `<input>`).
- **CSS3**: Custom CSS Variables, Glassmorphism backdrop filters, Flexbox, CSS Grid, media queries, and keyframe animations.
- **Vanilla JavaScript (ES6+)**: Pure JS DOM manipulation, event delegation, modular functional programming, and Array methods (`push`, `filter`, `find`, `map`).

*No React, Vue, Angular, Bootstrap, Tailwind, jQuery, or third-party libraries were used.*

---

## 📁 Project Structure

```text
to-do/
│
├── index.html          # Main HTML5 application container & semantic layout
├── css/
│   └── style.css       # Complete CSS design system, themes, & media queries
├── js/
│   └── script.js       # Core JavaScript logic, array state, & DOM handlers
└── README.md           # Documentation & project guide
```

---

## 🚀 How to Run

1. **Clone or Download** the repository folder to your local machine.
2. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. No build tools, bundlers, or local server installations are required!

---

## ⚙️ Application Architecture & Workflow

TaskFlow operates using a uni-directional state rendering model:

1. **State Management**: The application state is stored in an in-memory `state` object:
   ```javascript
   const state = {
     tasks: [
       { id: "task_1234", text: "Buy groceries", completed: false, createdAt: "2026-08-19T..." }
     ],
     currentFilter: 'all',
     editingTaskId: null
   };
   ```
2. **State Mutations**: Modifying functions (`addTask`, `editTask`, `toggleTask`, `deleteTask`, `clearCompletedTasks`) update the `state.tasks` array.
3. **Persistence & Re-render**: Following any mutation, `saveTasksToStorage()`, `renderTasks()`, and `updateStats()` are invoked to synchronously update `localStorage` and repaint the DOM nodes cleanly.

---

## 💡 Key JavaScript Concepts Demonstrated

- **Variables & Scope**: `const`, `let`, block scoping, and strict mode (`'use strict'`).
- **Data Structures**: JavaScript Arrays and Objects representing tasks and global state.
- **Array Methods**:
  - `push()`: Appends newly created task objects to `state.tasks`.
  - `filter()`: Calculates task metrics (pending vs completed) and handles task deletion / filtering.
  - `find()`: Retrieves target task by unique ID for toggling completion or inline editing.
  - `map()`: Applied for state transformations and list projections.
- **Modular Functions**:
  - `addTask(text)`
  - `editTask(id, newText)`
  - `toggleTask(id)`
  - `deleteTask(id)`
  - `renderTasks()`
  - `updateStats()`
  - `validateTask(text)`
- **DOM Selection & Building**: Safe Node creation using `document.createElement()`, `element.setAttribute()`, and `element.appendChild()`.
- **Event Handling & Delegation**: Form submit listeners, keyboard navigation handlers (Enter / Escape), and container event delegation.

---

## ♿ Accessibility Compliance (a11y)

- **Semantic HTML5**: Native tags convey structural layout to screen readers.
- **Form Controls**: Input fields feature hidden `<label>` elements linked via `for` and `id` attributes.
- **ARIA Attributes**: `aria-live="polite"` for statistics and empty state updates; `aria-label` for icon-only edit/delete buttons.
- **Visible Focus Rings**: Clean `:focus-visible` outline rings on all interactive elements.
- **Color Contrast**: Complies with WCAG AA minimum contrast ratio standard for high legibility.

---

## 🔒 Security & Input Sanitation

- **XSS Vulnerability Prevention**: User input is **never** assigned to unsafe properties such as `innerHTML`.
- **Safe Text Assignment**: Task text is assigned directly via `element.textContent = task.text`, ensuring any user-entered HTML tags or scripts are rendered safely as plain text strings.
- **Input Validation**: `validateTask()` strips leading/trailing whitespace (`trim()`) and enforces non-empty constraints.

---

## 🧪 Testing & Scenario Validation

The application has been verified across key operational test suites:

### 1. Task Creation Testing
- ✅ **Valid Task**: Adding "Complete JS Project" successfully appends task and updates statistics.
- ✅ **Empty Input**: Attempting to add an empty string displays an input error message.
- ✅ **Whitespace Input**: Submitting spaces only (`"   "`) is blocked and flagged as invalid.
- ✅ **Long Input**: Long text wraps cleanly without breaking the card container.

### 2. Task Editing Testing
- ✅ **Normal Edit**: Inline edit updates text in memory and DOM smoothly.
- ✅ **Empty Edit Attempt**: Saving empty text alerts the user and prevents invalid states.
- ✅ **Escape to Cancel**: Pressing `Escape` during edit cancels changes and restores original title.

### 3. Task Completion & Deletion
- ✅ **Toggle Checkbox**: Checked state updates pending/completed counts and applies strikethrough styling.
- ✅ **Single Delete**: Delete button removes target item and updates stats.
- ✅ **Empty State Display**: Deleting all tasks displays the empty state graphic and title.

### 4. Responsive Layout Verification
Verified across breakpoints:
- 📱 **320px & 375px (Mobile)**: Clean single-column layout, touch-friendly buttons, zero horizontal scroll.
- 📱 **768px (Tablet)**: Balanced statistics grid and input container.
- 💻 **1024px & 1440px (Desktop)**: Centered card container with glassmorphism backdrop.

---

## 🔮 Future Improvements

- **Task Categories / Tags**: Add color-coded tags (e.g., Work, Personal, Shopping).
- **Due Dates & Priority**: Ability to attach due dates and sort tasks by priority.
- **Drag and Drop**: Re-order task items via native HTML Drag and Drop API.
- **Dark / Light Theme Toggle**: User preference toggle for light background theme.

---

*Crafted for TaskFlow Productivity.*
