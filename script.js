let tasks = [];
let taskId = 1;
let currentFilter = 'all';

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
    
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit your task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
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