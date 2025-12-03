import type { Task } from './constants';
import { STORAGE_KEY } from './constants';

export const loadTasks = (): Task[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load tasks:', error);
        return [];
    }
};

export const saveTasks = (tasks: Task[]): void => {
    try {
        // Don't save UI state (expanded)
        const cleanedTasks = tasks.map(({ id, text, date, time, recurring }) => ({
            id,
            text,
            date,
            time,
            recurring,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedTasks));
    } catch (error) {
        console.error('Failed to save tasks:', error);
    }
};
