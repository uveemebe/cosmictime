import './style.css';
import type { Task, Weekday } from './constants';
import { WEEKDAYS, DOM_IDS, getDayId } from './constants';
import { loadTasks, saveTasks } from './storage';
import {
  uiState,
  toggleTaskExpansion,
  renderTask,
  renderEmptyState,
  getWeekdayButtonClass,
  getDailyMantra
} from './components';

// App state
let tasks: Task[] = [];

// Render tasks
const renderTasks = (): void => {
  const taskList = document.getElementById(DOM_IDS.TASK_LIST);
  if (!taskList) return;

  if (tasks.length === 0) {
    taskList.innerHTML = renderEmptyState();
    return;
  }

  taskList.innerHTML = tasks.map(renderTask).join('');
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
  saveTasks(tasks);
  renderTasks();
};

// Toggle weekday selection
const toggleDay = (day: Weekday): void => {
  if (uiState.selectedDays.has(day)) {
    uiState.selectedDays.delete(day);
  } else {
    uiState.selectedDays.add(day);
  }
  updateDayButtons();
};

// Update day button states
const updateDayButtons = (): void => {
  WEEKDAYS.forEach((day, index) => {
    const btn = document.getElementById(getDayId(day));
    if (btn) {
      btn.className = getWeekdayButtonClass(day, index);
    }
  });
};

// Modal controls
const openTaskModal = (): void => {
  const modal = document.getElementById(DOM_IDS.MODAL);
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  const textInput = document.getElementById(DOM_IDS.TASK_TEXT) as HTMLInputElement;
  textInput?.focus();
};

const closeTaskModal = (): void => {
  const modal = document.getElementById(DOM_IDS.MODAL);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');

  const form = document.getElementById(DOM_IDS.FORM) as HTMLFormElement;
  form?.reset();
  uiState.selectedDays.clear();
  updateDayButtons();
};

// Form submission
const saveTask = (e: Event): void => {
  e.preventDefault();

  const textInput = document.getElementById(DOM_IDS.TASK_TEXT) as HTMLInputElement;
  const dateInput = document.getElementById(DOM_IDS.TASK_DATE) as HTMLInputElement;
  const timeInput = document.getElementById(DOM_IDS.TASK_TIME) as HTMLInputElement;

  const text = textInput?.value.trim();
  if (!text) return;

  addTask(
    text,
    dateInput?.value || undefined,
    timeInput?.value || undefined,
    uiState.selectedDays.size > 0 ? Array.from(uiState.selectedDays) : undefined
  );

  closeTaskModal();
};

// Initialize app
const initApp = (): void => {
  const app = document.querySelector<HTMLDivElement>(`#${DOM_IDS.APP}`);
  if (!app) return;

  app.innerHTML = `
    <div class="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6 min-h-[300px] flex flex-col justify-between border border-gray-200">
      <div id="${DOM_IDS.TASK_LIST}" class="flex-grow"></div>
      <footer class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <span class="text-xs text-gray-400 italic">${getDailyMantra()}</span>
        <button id="${DOM_IDS.ADD_BTN}" class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:scale-105 hover:shadow-lg transition-all active:scale-95" aria-label="Add task">
          <img src="/add.svg" alt="Add" class="w-6 h-6" />
        </button>
      </footer>
    </div>

    <div id="${DOM_IDS.MODAL}" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <form id="${DOM_IDS.FORM}" class="space-y-4">
          <input
            type="text"
            id="${DOM_IDS.TASK_TEXT}"
            maxlength="128"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="What needs to be done?"
          />

          <div class="grid grid-cols-2 gap-3">
            <input
              type="date"
              id="${DOM_IDS.TASK_DATE}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
            />
            <input
              type="time"
              id="${DOM_IDS.TASK_TIME}"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
            />
          </div>

          <div class="flex justify-center gap-2">
            ${WEEKDAYS.map(day => `<button type="button" id="${getDayId(day)}" class="w-3 h-3 rounded-full border-2 border-blue-500 hover:opacity-70 transition-all"></button>`).join('')}
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <button type="button" id="${DOM_IDS.CANCEL_BTN}" class="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Delegated event listeners (prevents memory leaks)
  document.getElementById(DOM_IDS.ADD_BTN)?.addEventListener('click', openTaskModal);
  document.getElementById(DOM_IDS.CANCEL_BTN)?.addEventListener('click', closeTaskModal);
  document.getElementById(DOM_IDS.FORM)?.addEventListener('submit', saveTask);

  // Weekday buttons
  WEEKDAYS.forEach(day => {
    document.getElementById(getDayId(day))?.addEventListener('click', () => toggleDay(day));
  });

  // Modal backdrop click
  document.getElementById(DOM_IDS.MODAL)?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTaskModal();
  });

  // Task list delegation (fix memory leak)
  document.getElementById(DOM_IDS.TASK_LIST)?.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.task-item') as HTMLElement;
    if (target?.dataset.taskId) {
      toggleTaskExpansion(target.dataset.taskId);
      renderTasks();
    }
  });

  // Load and render
  tasks = loadTasks();
  renderTasks();
};

// Start app
initApp();
