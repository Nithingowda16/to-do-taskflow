/**
 * TaskFlow - Interactive To-Do List Application
 * Developed with HTML5, CSS3, and Vanilla JavaScript (ES6+)
 * 
 * Features:
 * - Add, Edit, Toggle Completion, and Delete tasks dynamically
 * - Real-time Task Statistics (Total, Pending, Completed)
 * - Filtering (All, Pending, Completed) & Clear Completed
 * - XSS-safe DOM Manipulation using textContent
 * - LocalStorage Persistence & Keyboard Accessibility
 */

'use strict';

/* ==========================================================================
   1. Application State & Storage Keys
   ========================================================================== */
const STORAGE_KEY = 'taskflow_app_tasks';

// Core State Object
const state = {
  tasks: [],
  currentFilter: 'all', // 'all' | 'pending' | 'completed'
  editingTaskId: null   // Stores ID of task currently being edited, if any
};

/* ==========================================================================
   2. DOM Element Selectors
   ========================================================================== */
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const inputErrorMsg = document.getElementById('input-error-msg');

const totalCountEl = document.getElementById('total-count');
const pendingCountEl = document.getElementById('pending-count');
const completedCountEl = document.getElementById('completed-count');

const taskListEl = document.getElementById('task-list');
const emptyStateEl = document.getElementById('empty-state');
const emptyStateTitleEl = document.getElementById('empty-state-title');
const emptyStateSubtitleEl = document.getElementById('empty-state-subtitle');

const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

/* ==========================================================================
   3. Core Task Operations (State Mutation & Array Logic)
   ========================================================================== */

/**
 * Validate input task string.
 * @param {string} text - Raw input string
 * @returns {{ valid: boolean, trimmedText: string, errorMessage: string }}
 */
function validateTask(text) {
  if (typeof text !== 'string') {
    return { valid: false, trimmedText: '', errorMessage: 'Invalid input format.' };
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    return { valid: false, trimmedText: '', errorMessage: 'Task description cannot be empty.' };
  }

  if (trimmedText.length > 200) {
    return { valid: false, trimmedText: '', errorMessage: 'Task description cannot exceed 200 characters.' };
  }

  return { valid: true, trimmedText: trimmedText, errorMessage: '' };
}

/**
 * Add a new task to the array state.
 * @param {string} text - Validated text content of the task
 * @returns {boolean} Success status
 */
function addTask(text) {
  const validation = validateTask(text);
  if (!validation.valid) {
    showInputError(validation.errorMessage);
    return false;
  }

  clearInputError();

  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    text: validation.trimmedText,
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Standard Array Method: push()
  state.tasks.push(newTask);

  saveTasksToStorage();
  renderTasks();
  updateStats();

  return true;
}

/**
 * Toggle task completed status.
 * @param {string} id - Unique identifier of the task
 */
function toggleTask(id) {
  // Standard Array Method: find()
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasksToStorage();
    renderTasks();
    updateStats();
  }
}

/**
 * Edit an existing task's text content.
 * @param {string} id - Unique identifier of the task
 * @param {string} newText - New text content
 * @returns {boolean} Success status
 */
function editTask(id, newText) {
  const validation = validateTask(newText);
  if (!validation.valid) {
    alert(validation.errorMessage);
    return false;
  }

  // Standard Array Method: find()
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.text = validation.trimmedText;
    state.editingTaskId = null;
    saveTasksToStorage();
    renderTasks();
    updateStats();
    return true;
  }

  return false;
}

/**
 * Delete a task by ID.
 * @param {string} id - Unique identifier of the task
 */
function deleteTask(id) {
  // Standard Array Method: filter()
  state.tasks = state.tasks.filter(task => task.id !== id);

  if (state.editingTaskId === id) {
    state.editingTaskId = null;
  }

  saveTasksToStorage();
  renderTasks();
  updateStats();
}

/**
 * Clear all completed tasks from the array.
 */
function clearCompletedTasks() {
  // Standard Array Method: filter()
  const initialLength = state.tasks.length;
  state.tasks = state.tasks.filter(task => !task.completed);

  if (state.tasks.length < initialLength) {
    saveTasksToStorage();
    renderTasks();
    updateStats();
  }
}

/**
 * Update task statistics counters in UI.
 * Demonstrates usage of filter() array method.
 */
function updateStats() {
  const total = state.tasks.length;

  // Standard Array Method: filter()
  const completedTasks = state.tasks.filter(task => task.completed);
  const pendingTasks = state.tasks.filter(task => !task.completed);

  const completed = completedTasks.length;
  const pending = pendingTasks.length;

  totalCountEl.textContent = total;
  pendingCountEl.textContent = pending;
  completedCountEl.textContent = completed;

  // Enable/disable Clear Completed button
  if (completed > 0) {
    clearCompletedBtn.style.opacity = '1';
    clearCompletedBtn.style.pointerEvents = 'auto';
  } else {
    clearCompletedBtn.style.opacity = '0.5';
    clearCompletedBtn.style.pointerEvents = 'none';
  }
}

/* ==========================================================================
   4. UI Rendering & DOM Building (Safe HTML Generation)
   ========================================================================== */

/**
 * Filter tasks array based on current tab selection.
 * Uses filter() array method.
 * @returns {Array} Filtered task list
 */
function getFilteredTasks() {
  if (state.currentFilter === 'pending') {
    return state.tasks.filter(task => !task.completed);
  } else if (state.currentFilter === 'completed') {
    return state.tasks.filter(task => task.completed);
  }
  // Standard Array Method: map() can be used when transforming list elements
  return state.tasks;
}

/**
 * Dynamically re-render the task list and update empty state visibility.
 */
function renderTasks() {
  // Clear existing task list elements
  taskListEl.innerHTML = '';

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    emptyStateEl.classList.add('visible');
    
    // Customize empty state message according to active filter
    if (state.tasks.length === 0) {
      emptyStateTitleEl.textContent = 'No tasks yet. Add your first task!';
      emptyStateSubtitleEl.textContent = 'Keep track of your goals and stay organized every day.';
    } else if (state.currentFilter === 'pending') {
      emptyStateTitleEl.textContent = 'No pending tasks!';
      emptyStateSubtitleEl.textContent = 'Awesome job! You have completed all your tasks.';
    } else if (state.currentFilter === 'completed') {
      emptyStateTitleEl.textContent = 'No completed tasks yet.';
      emptyStateSubtitleEl.textContent = 'Complete some tasks to see them listed here.';
    }
    return;
  } else {
    emptyStateEl.classList.remove('visible');
  }

  // Render each task node safely
  filteredTasks.forEach(task => {
    const taskItem = createTaskElement(task);
    taskListEl.appendChild(taskItem);
  });
}

/**
 * Construct DOM elements for a task item cleanly using document.createElement.
 * Never uses unsafe innerHTML with task text to prevent XSS vulnerabilities.
 * @param {Object} task - Task object
 * @returns {HTMLLIElement} Formatted list item element
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.setAttribute('data-id', task.id);

  // If this task is currently being edited
  if (state.editingTaskId === task.id) {
    const editForm = document.createElement('form');
    editForm.className = 'edit-form';
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const editInput = editForm.querySelector('.edit-input');
      editTask(task.id, editInput.value);
    });

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;
    editInput.maxLength = 200;

    const editActions = document.createElement('div');
    editActions.className = 'edit-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'btn btn-primary';
    saveBtn.style.padding = '0.4rem 0.75rem';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.style.padding = '0.4rem 0.75rem';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      state.editingTaskId = null;
      renderTasks();
    });

    editActions.appendChild(saveBtn);
    editActions.appendChild(cancelBtn);

    editForm.appendChild(editInput);
    editForm.appendChild(editActions);

    li.appendChild(editForm);

    // Auto focus edit input once mounted
    setTimeout(() => {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }, 0);

    // Handle Escape key to cancel edit
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        state.editingTaskId = null;
        renderTasks();
      }
    });

    return li;
  }

  // Normal Task Display Node Construction
  const contentDiv = document.createElement('div');
  contentDiv.className = 'task-content';

  // Checkbox Container
  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'checkbox-container';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'pending' : 'completed'}`);
  checkbox.addEventListener('change', () => toggleTask(task.id));

  checkboxLabel.appendChild(checkbox);

  // Task Title Span (Safe text insertion via textContent)
  const titleSpan = document.createElement('span');
  titleSpan.className = 'task-title';
  titleSpan.textContent = task.text;

  contentDiv.appendChild(checkboxLabel);
  contentDiv.appendChild(titleSpan);

  // Action Buttons Container (Edit & Delete)
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';

  // Edit Button
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn-icon-only edit-btn';
  editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
  editBtn.setAttribute('title', 'Edit Task');
  editBtn.innerHTML = `
    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `;
  editBtn.addEventListener('click', () => {
    state.editingTaskId = task.id;
    renderTasks();
  });

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-icon-only delete-btn';
  deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
  deleteBtn.setAttribute('title', 'Delete Task');
  deleteBtn.innerHTML = `
    <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(contentDiv);
  li.appendChild(actionsDiv);

  return li;
}

/* ==========================================================================
   5. Event Handlers & Input UI Helper Functions
   ========================================================================== */

function showInputError(msg) {
  inputErrorMsg.textContent = msg;
  taskInput.classList.add('has-error');
  taskInput.setAttribute('aria-invalid', 'true');
}

function clearInputError() {
  inputErrorMsg.textContent = '';
  taskInput.classList.remove('has-error');
  taskInput.removeAttribute('aria-invalid');
}

/**
 * Handle Task Creation Form Submission
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const rawText = taskInput.value;

  const success = addTask(rawText);
  if (success) {
    taskInput.value = '';
    taskInput.focus();
  }
}

/**
 * Handle Filter Tab Clicks
 */
function handleFilterClick(e) {
  const target = e.target.closest('.filter-btn');
  if (!target) return;

  const newFilter = target.getAttribute('data-filter');
  if (newFilter && state.currentFilter !== newFilter) {
    state.currentFilter = newFilter;

    // Update active tab visual state & ARIA attributes
    filterBtns.forEach(btn => {
      const isActive = btn === target;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderTasks();
  }
}

/* ==========================================================================
   6. LocalStorage Persistence Layer
   ========================================================================== */

function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

function loadTasksFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        state.tasks = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    state.tasks = [];
  }
}

/* ==========================================================================
   7. Application Initialization
   ========================================================================== */

function initApp() {
  // 1. Load persisted data
  loadTasksFromStorage();

  // 2. Attach Event Listeners
  taskForm.addEventListener('submit', handleFormSubmit);

  taskInput.addEventListener('input', () => {
    if (taskInput.classList.contains('has-error')) {
      clearInputError();
    }
  });

  const filterContainer = document.querySelector('.filter-tabs');
  if (filterContainer) {
    filterContainer.addEventListener('click', handleFilterClick);
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
  }

  // 3. Initial UI render and stats calculation
  renderTasks();
  updateStats();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
