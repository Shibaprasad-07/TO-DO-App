let tasks = [];
let taskId = 1;

// Human-like AI responses
const greetings = [
    "What's on your mind today?",
    "Ready to tackle some tasks together?",
    "I'm here to help! What shall we do?",
    "Let's make today productive! 😊"
];

const responses = [
    "Nice! I added that for you 👍",
    "Got it! That sounds important 💪",
    "Added to your list! You've got this! ✨",
    "Perfect! I'm keeping track of that 📝",
    "Done! I believe you can handle this 🌟"
];

const completionMessages = [
    "Awesome job! You're crushing it! 🎉",
    "Well done! I'm proud of you! 👏",
    "Great work! Keep it up! 💪",
    "You did it! That's the spirit! ⭐"
];

const encouragements = [
    "You're doing great! Keep going! 💪",
    "I believe in you! You've got this! 🌟",
    "Every task completed is progress! 🚀",
    "You're more capable than you know! ✨"
];

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const aiResponse = document.getElementById('aiResponse');
const greeting = document.getElementById('greeting');
const totalEl = document.getElementById('total');
const doneEl = document.getElementById('done');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    greeting.textContent = greetings[Math.floor(Math.random() * greetings.length)];
    
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
    
    // Smart AI response based on task content
    let response = responses[Math.floor(Math.random() * responses.length)];
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('important')) {
        response = "I can see this is important! Let's prioritize this! 🔥";
    } else if (text.toLowerCase().includes('exercise') || text.toLowerCase().includes('workout')) {
        response = "Great choice! Your health matters! 💪";
    }
    
    showAIResponse(response);
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        
        if (task.completed) {
            showAIResponse(completionMessages[Math.floor(Math.random() * completionMessages.length)]);
        }
        
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    showAIResponse("Removed! Sometimes it's good to let things go 😌");
    renderTasks();
    updateStats();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit your task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            showAIResponse("Updated! I like how you're refining your goals! ✨");
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
    
    // Show encouragement occasionally
    if (tasks.length > 0 && Math.random() < 0.2) {
        setTimeout(() => {
            showAIResponse(encouragements[Math.floor(Math.random() * encouragements.length)]);
        }, 2000);
    }
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

function showAIResponse(message) {
    aiResponse.textContent = message;
    aiResponse.style.display = 'block';
    
    setTimeout(() => {
        aiResponse.style.display = 'none';
    }, 3000);
}

// Smart greeting based on time
function updateGreeting() {
    const hour = new Date().getHours();
    let timeGreeting = "What's on your mind today?";
    
    if (hour < 12) timeGreeting = "Good morning! Ready to start fresh? ☀️";
    else if (hour < 18) timeGreeting = "Good afternoon! How's your day going? 😊";
    else timeGreeting = "Good evening! Let's wrap up strong! 🌙";
    
    greeting.textContent = timeGreeting;
}

// Update greeting on load
setTimeout(updateGreeting, 1000);