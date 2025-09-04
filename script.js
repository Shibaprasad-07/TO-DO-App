let tasks = [];
let taskId = 1;
let currentFilter = 'all';

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        tasks = JSON.parse(saved);
        taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('todos', JSON.stringify(tasks));
}

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const greeting = document.getElementById('greeting');
const totalEl = document.getElementById('total');
const doneEl = document.getElementById('done');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
    
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterTasks();
        });
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    const task = {
        id: taskId++,
        text: text,
        completed: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit your task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

function renderTasks() {
    taskList.innerHTML = tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            </div>
        </li>
    `).join('');
    
    filterTasks();
}

function filterTasks() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach((item, index) => {
        const task = tasks[index];
        let show = true;
        
        if (currentFilter === 'pending' && task.completed) show = false;
        if (currentFilter === 'done' && !task.completed) show = false;
        
        item.classList.toggle('hidden', !show);
    });
}

function updateStats() {
    const completed = tasks.filter(t => t.completed).length;
    totalEl.textContent = tasks.length;
    doneEl.textContent = completed;
}