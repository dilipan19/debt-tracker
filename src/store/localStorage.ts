import type { RootState } from './store';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('debtTrackerState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('debtTrackerState', serializedState);
    } catch {
        // ignore write errors
    }
};
