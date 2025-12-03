// Task interface
export interface Task {
    id: string;
    text: string;
    date?: string;
    time?: string;
    recurring?: string[];
}

// Weekday type
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// Constants
export const WEEKDAYS: readonly Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export const STORAGE_KEY = 'cosmictime-tasks';

export const DOM_IDS = {
    APP: 'app',
    TASK_LIST: 'task-list',
    MODAL: 'task-modal',
    FORM: 'task-form',
    TASK_TEXT: 'task-text',
    TASK_DATE: 'task-date',
    TASK_TIME: 'task-time',
    ADD_BTN: 'add-btn',
    CANCEL_BTN: 'cancel-btn',
} as const;

export const MANTRAS: Record<number, string> = {
    0: "Calibrating instruments for the next rotation.",
    1: "Initiating launch sequence. Cosmic focus required.",
    2: "Navigating the asteroid field of tasks. Stay steady.",
    3: "Halfway across the galaxy. Maintain trajectory.",
    4: "Warp speed engaged. The weekend nebula is in sight.",
    5: "Landing gear deployed. Prepare for cosmic leisure.",
    6: "Drifting in the void. Organize your stardust.",
} as const;

export const isWeekend = (index: number): boolean => index >= 5;

export const getDayId = (day: Weekday): string => `day-${day}`;
