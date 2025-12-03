import './style.css'

// Task interface
interface Task {
  id: string;
  text: string;
  date?: string;
  time?: string;
  recurring?: string[]; // ['mon', 'wed', 'fri']
  expanded?: boolean; // UI state only, not persisted
}

// State
let tasks: Task[] = [];
let selectedDays: string[] = [];

// Load tasks from localStorage
const loadTasks = (): void => {
  const stored = localStorage.getItem('cosmictime-tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
};

// Save tasks to localStorage
const saveTasks = (): void => {
  localStorage.setItem('cosmictime-tasks', JSON.stringify(tasks));
};

// Toggle task expansion
const toggleTask = (taskId: string): void => {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.expanded = !task.expanded;
    renderTasks();
  }
};

// Format recurring days as visual circles
const formatRecurring = (days: string[]): string => {
  const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const circles = allDays.map((day, index) => {
    const isActive = days.includes(day);
    const isWeekend = index >= 5; // sat, sun

    if (isActive) {
      const color = isWeekend ? 'bg-amber-500' : 'bg-blue-500';
      return `<span class="inline-block w-2 h-2 rounded-full ${color}"></span>`;
    } else {
      const borderColor = isWeekend ? 'border-amber-500' : 'border-blue-500';
      return `<span class="inline-block w-2 h-2 rounded-full border ${borderColor}"></span>`;
    }
  }).join(' ');

  return circles;
};

// Render tasks
const renderTasks = (): void => {
  const taskList = document.getElementById('task-list')!;

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="text-gray-400 text-center py-8 italic">No tasks yet.</p>';
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div 
      class="task-item bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
      data-task-id="${task.id}"
    >
      <p class="text-gray-800 text-sm ${task.expanded ? '' : 'truncate'}">${task.text}</p>
      ${task.date || task.time || task.recurring ? `
        <div class="flex gap-3 text-xs text-gray-500 mt-1">
          ${task.date ? `<span>${task.date}</span>` : ''}
          ${task.time ? `<span>${task.time}</span>` : ''}
          ${task.recurring && task.recurring.length > 0 ? `<span>${formatRecurring(task.recurring)}</span>` : ''}
        </div>
      ` : ''}
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const taskId = (e.currentTarget as HTMLElement).dataset.taskId!;
      toggleTask(taskId);
    });
  });
};

// Add task
const addTask = (text: string, date?: string, time?: string, recurring?: string[]): void => {
  const task: Task = {
    id: Date.now().toString(),
    text,
    date,
    time,
    recurring,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
};

// Toggle weekday selection
const toggleDay = (day: string): void => {
  const index = selectedDays.indexOf(day);
  if (index > -1) {
    selectedDays.splice(index, 1);
  } else {
    selectedDays.push(day);
  }
  updateDayButtons();
};

// Update day button states
const updateDayButtons = (): void => {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  days.forEach((day, index) => {
    const btn = document.getElementById(`day-${day}`)!;
    const isWeekend = index >= 5;

    if (selectedDays.includes(day)) {
      const color = isWeekend ? 'bg-amber-500' : 'bg-blue-500';
      btn.className = `w-3 h-3 rounded-full ${color} border-2 border-transparent hover:opacity-80 transition-all`;
    } else {
      const borderColor = isWeekend ? 'border-amber-500' : 'border-blue-500';
      btn.className = `w-3 h-3 rounded-full border-2 ${borderColor} hover:opacity-70 transition-all`;
    }
  });
};

// Show modal
const showModal = (): void => {
  const modal = document.getElementById('task-modal')!;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Focus on text input
  const textInput = document.getElementById('task-text') as HTMLInputElement;
  textInput.focus();
};

// Hide modal
const hideModal = (): void => {
  const modal = document.getElementById('task-modal')!;
  modal.classList.add('hidden');
  modal.classList.remove('flex');

  // Reset form
  const form = document.getElementById('task-form') as HTMLFormElement;
  form.reset();
  selectedDays = [];
  updateDayButtons();
};

// Handle form submission
const handleSubmit = (e: Event): void => {
  e.preventDefault();

  const textInput = document.getElementById('task-text') as HTMLInputElement;
  const dateInput = document.getElementById('task-date') as HTMLInputElement;
  const timeInput = document.getElementById('task-time') as HTMLInputElement;

  const text = textInput.value.trim();
  if (!text) return;

  addTask(
    text,
    dateInput.value || undefined,
    timeInput.value || undefined,
    selectedDays.length > 0 ? [...selectedDays] : undefined
  );

  hideModal();
};

// Mantras
const mantras: Record<number, string> = {
  1: "Initiating launch sequence. Cosmic focus required.",
  2: "Navigating the asteroid field of tasks. Stay steady.",
  3: "Halfway across the galaxy. Maintain trajectory.",
  4: "Warp speed engaged. The weekend nebula is in sight.",
  5: "Landing gear deployed. Prepare for cosmic leisure.",
  6: "Drifting in the void. Organize your stardust.",
  0: "Calibrating instruments for the next rotation.",
};

const today = new Date().getDay();
const dailyMantra = mantras[today];

// Initialize app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6 min-h-[300px] flex flex-col justify-between border border-gray-200">
    <div id="task-list" class="flex-grow">
      <!-- Tasks will go here -->
    </div>
    <footer class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
      <span class="text-xs text-gray-400 italic">${dailyMantra}</span>
      <button id="add-btn" class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:scale-105 hover:shadow-lg transition-all active:scale-95" aria-label="Add task">
        <img src="/add.svg" alt="Add" class="w-6 h-6" />
      </button>
    </footer>
  </div>

  <!-- Modal -->
  <div id="task-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <form id="task-form" class="space-y-4">
        <input
          type="text"
          id="task-text"
          maxlength="128"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="What needs to be done?"
        />

        <div class="grid grid-cols-2 gap-3">
          <input
            type="date"
            id="task-date"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
          />

          <input
            type="time"
            id="task-time"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
          />
        </div>

        <!-- Weekday selector centered below date -->
        <div class="flex justify-center gap-2">
          <button type="button" id="day-mon" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-tue" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-wed" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-thu" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-fri" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-sat" class="w-3 h-3 rounded-full border-2 border-amber-500 hover:opacity-70 transition-all"></button>
          <button type="button" id="day-sun" class="w-3 h-3 rounded-full border-2 border-amber-500 hover:opacity-70 transition-all"></button>
        </div>

        <div class="flex gap-3 justify-end pt-2">
          <button
            type="button"
            id="cancel-btn"
            class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
`;

// Event listeners
document.getElementById('add-btn')!.addEventListener('click', showModal);
document.getElementById('cancel-btn')!.addEventListener('click', hideModal);
document.getElementById('task-form')!.addEventListener('submit', handleSubmit);

// Weekday button listeners
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
days.forEach(day => {
  document.getElementById(`day-${day}`)!.addEventListener('click', () => toggleDay(day));
});

// Close modal on backdrop click
document.getElementById('task-modal')!.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    hideModal();
  }
});

// Load and render tasks
loadTasks();
renderTasks();
