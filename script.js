document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        deadline: document.getElementById('deadline').value,
        priority: document.getElementById('priority').value
    };
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(task)
    });
    if (response.ok) {
        loadTasks();
    }
});

async function loadTasks() {
    const response = await fetch('/api/tasks', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const tasks = await response.json();
    document.getElementById('tasks').innerHTML = tasks.map(task => `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Deadline: ${task.deadline}</p>
            <p>Priority: ${task.priority}</p>
        </div>
    `).join('');
}
tasks.push(newTask);
  saveTasksToLocalStorage();
  renderTasks();

  // Clear input fields
  taskTitleInput.value = '';
  taskDescriptionInput.value = '';
  taskDueDateInput.value = '';
  taskPriorityInput.value = '';
;

// Render Tasks
function renderTasks(filter = '') {
  taskList.innerHTML = ''; // Clear previous list
  const filteredTasks = filter
    ? tasks.filter((task) => task.priority === filter)
    : tasks;

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <div class="task-details">
        <strong>${task.title}</strong> - ${task.priority} Priority<br>
        <small>Due: ${task.dueDate}</small><br>
        <small>${task.description}</small>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const taskToEdit = tasks.find((task) => task.id === id);
  if (!taskToEdit) return;

  // Pre-fill the form with the selected task's details
  taskTitleInput.value = taskToEdit.title;
  taskDescriptionInput.value = taskToEdit.description;
  taskDueDateInput.value = taskToEdit.dueDate;
  taskPriorityInput.value = taskToEdit.priority;

  // Update button behavior to save the edited task
  addTaskButton.textContent = 'Save Changes';
  addTaskButton.onclick = () => {
    taskToEdit.title = taskTitleInput.value;
    taskToEdit.description = taskDescriptionInput.value;
    taskToEdit.dueDate = taskDueDateInput.value;
    taskToEdit.priority = taskPriorityInput.value;

    saveTasksToLocalStorage();
    renderTasks();

    // Reset button and clear form
    addTaskButton.textContent = 'Add Task';
    addTaskButton.onclick = addNewTask; // Reset to default add functionality
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskDueDateInput.value = '';
    taskPriorityInput.value = '';
  };
}

// Save tasks to Local Storage
function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Notifications for Due Tasks
function checkNotifications() {
  const now = new Date().toISOString().split('T')[0];
  tasks.forEach((task) => {
    if (task.dueDate === now) {
      alert(`Reminder: Task "${task.title}" is due today!`);
    }
  });
}

// Filter Tasks by Priority
filterSelect.addEventListener('change', (e) => {
  const filter = e.target.value;
  renderTasks(filter);
});

// Initial Render
renderTasks();
checkNotifications();
if (Notification.permission === "granted") {
    new Notification(`Reminder: Task "${task.title}" is due today!`);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(`Reminder: Task "${task.title}" is due today!`);
      }
    });
  }
  

