import type { Task, Weekday } from './constants';
import { WEEKDAYS, isWeekend, MANTRAS } from './constants';

// UI State (not persisted)
export const uiState = {
    selectedDays: new Set<Weekday>(),
    expandedTasks: new Set<string>(),
};

export const toggleTaskExpansion = (taskId: string): void => {
    if (uiState.expandedTasks.has(taskId)) {
        uiState.expandedTasks.delete(taskId);
    } else {
        uiState.expandedTasks.add(taskId);
    }
};

export const formatRecurring = (days: string[]): string => {
    return WEEKDAYS.map((day, index) => {
        const isActive = days.includes(day);
        const weekend = isWeekend(index);
        const color = weekend ? (isActive ? 'bg-amber-500' : 'border-amber-500') : (isActive ? 'bg-blue-500' : 'border-blue-500');
        const classes = isActive ? color : `border ${color}`;
        return `<span class="inline-block w-2 h-2 rounded-full ${classes}"></span>`;
    }).join(' ');
};

export const renderTask = (task: Task): string => {
    const isExpanded = uiState.expandedTasks.has(task.id);
    const hasMetadata = task.date || task.time || (task.recurring && task.recurring.length > 0);

    return `
    <div 
      class="task-item bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
      data-task-id="${task.id}"
    >
      <p class="text-gray-800 text-sm ${isExpanded ? '' : 'truncate'}">${task.text}</p>
      ${hasMetadata ? `
        <div class="flex gap-3 text-xs text-gray-500 mt-1">
          ${task.date ? `<span>${task.date}</span>` : ''}
          ${task.time ? `<span>${task.time}</span>` : ''}
          ${task.recurring && task.recurring.length > 0 ? `<span>${formatRecurring(task.recurring)}</span>` : ''}
        </div>
      ` : ''}
    </div>
  `;
};

export const renderEmptyState = (): string => {
    return '<p class="text-gray-400 text-center py-8 italic">No tasks yet.</p>';
};

export const getWeekdayButtonClass = (day: Weekday, index: number): string => {
    const isSelected = uiState.selectedDays.has(day);
    const weekend = isWeekend(index);

    if (isSelected) {
        const color = weekend ? 'bg-amber-500' : 'bg-blue-500';
        return `w-3 h-3 rounded-full ${color} border-2 border-transparent hover:opacity-80 transition-all`;
    } else {
        const borderColor = weekend ? 'border-amber-500' : 'border-blue-500';
        return `w-3 h-3 rounded-full border-2 ${borderColor} hover:opacity-70 transition-all`;
    }
};

export const getDailyMantra = (): string => {
    const today = new Date().getDay();
    return MANTRAS[today];
};
