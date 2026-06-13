/**
 * TaskFlow - Premium To-Do List Application Logic
 * 
 * This script manages the state of tasks (adding, deleting, toggling),
 * handles persistence using local storage, updates the graphical progress bar,
 * filters tasks by status, and coordinates CSS micro-animations.
 */

// --- 1. STATE MANAGEMENT ---
// Retrieve existing tasks from LocalStorage or initialize with an empty array if none exist.
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];

// Active filter state ('all', 'pending', 'completed')
let currentFilter = 'all';

// --- 2. DOM ELEMENT REFERENCES ---
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const progressSection = document.getElementById('progressSection');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const itemsLeftCount = document.getElementById('itemsLeftCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Filter button references
const filterAll = document.getElementById('filterAll');
const filterPending = document.getElementById('filterPending');
const filterCompleted = document.getElementById('filterCompleted');

// --- 3. UTILITY & PERSISTENCE FUNCTIONS ---

/**
 * Saves the current tasks state to LocalStorage
 */
function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

/**
 * Updates UI stats: items left, progress percentage, progress bar width,
 * and handles progress section visibility based on task count.
 */
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    // Update the footer text showing tasks remaining
    itemsLeftCount.textContent = `${pendingTasks} item${pendingTasks !== 1 ? 's' : ''} left`;

    if (totalTasks === 0) {
        // Hide progress tracker when list is empty
        progressSection.style.opacity = '0';
        progressSection.style.pointerEvents = 'none';
        // Add class helper to collapse height smoothly in CSS if desired, or keep simple opacity
        setTimeout(() => {
            if (tasks.length === 0) {
                progressSection.style.display = 'none';
            }
        }, 300);
        return;
    }

    // Display progress tracker if hidden
    progressSection.style.display = 'flex';
    // Allow thread to layout before rendering opacity transitions
    setTimeout(() => {
        progressSection.style.opacity = '1';
        progressSection.style.pointerEvents = 'all';
    }, 10);

    // Calculate percentage and update the progress bar width
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
}

// --- 4. TASK LOGIC & RENDER ENGINE ---

/**
 * Renders the task list to the screen based on the active filter
 */
function renderTasks() {
    // Clear the existing list content
    todoList.innerHTML = '';

    // Filter tasks array based on filter selection
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all' filter shows everything
    });

    // Toggle empty state graphics
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        // Custom empty state messages based on active filter
        const emptyTitle = emptyState.querySelector('.empty-title');
        const emptyText = emptyState.querySelector('.empty-text');
        if (currentFilter === 'completed') {
            emptyTitle.textContent = "No completed tasks";
            emptyText.textContent = "Complete tasks to see them listed here.";
        } else if (currentFilter === 'pending') {
            emptyTitle.textContent = "No active tasks";
            emptyText.textContent = "Add a task or check completed items.";
        } else {
            emptyTitle.textContent = "All caught up!";
            emptyText.textContent = "Add a new task to get started.";
        }
    } else {
        emptyState.classList.add('hidden');
    }

    // Create and append task list items dynamically
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        // Left Container (checkbox and text)
        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-item-left';

        // Checkbox wrapper label
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        // Add beautiful SVG checkmark icon inside the checkbox bubble
        checkmark.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkmark);

        // Task Title/Text element
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        // Set content safely via textContent to prevent cross-site scripting (XSS)
        taskSpan.textContent = task.text;

        leftDiv.appendChild(checkboxLabel);
        leftDiv.appendChild(taskSpan);

        // Delete button creation
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
        // Add custom clean inline SVG delete icon
        deleteBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        `;
        deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

        // Assemble list item
        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);

        // Add to DOM list
        todoList.appendChild(li);
    });

    // Keep statistics fresh
    updateStats();
}

/**
 * Adds a new task to the array
 */
function addTask(text) {
    const trimmedText = text.trim();
    if (trimmedText === '') return;

    const newTask = {
        id: Date.now(), // Unique identifier using timestamp
        text: trimmedText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    
    // Reset inputs & refocus field
    todoInput.value = '';
    
    // Re-render display
    renderTasks();
}

/**
 * Toggles the completion status of a task
 */
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

/**
 * Triggers exit animations and deletes a task from memory
 */
function deleteTask(id, element) {
    // Add the sliding/fade exit animation class
    element.classList.add('slide-exit');

    // Wait for the CSS transition/animation (300ms) to complete before updating database and DOM
    element.addEventListener('animationend', () => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    });
}

// --- 5. EVENT LISTENERS & INITIALIZATION ---

// Form Submission listener
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(todoInput.value);
});

// Clear Completed button listener
clearCompletedBtn.addEventListener('click', () => {
    // Highlight elements that will be deleted
    const completedItems = todoList.querySelectorAll('.todo-item.completed');
    
    if (completedItems.length === 0) return;

    // Apply slide-out animations to all completed task elements
    completedItems.forEach(item => item.classList.add('slide-exit'));

    // Wait for animation to finish then clean array and database
    if (completedItems.length > 0) {
        completedItems[0].addEventListener('animationend', () => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        });
    }
});

// Filter click controllers helper
const filterButtons = [
    { btn: filterAll, type: 'all' },
    { btn: filterPending, type: 'pending' },
    { btn: filterCompleted, type: 'completed' }
];

filterButtons.forEach(config => {
    config.btn.addEventListener('click', () => {
        // Toggle UI active styling
        filterButtons.forEach(b => b.btn.classList.remove('active'));
        config.btn.classList.add('active');

        // Apply state filter and redraw
        currentFilter = config.type;
        renderTasks();
    });
});

// App Startup: Perform initial layout load
renderTasks();
updateStats();
todoInput.focus();
