import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HistoryLog } from '../types';

interface HistoryState {
    logs: HistoryLog[];
    unreadCount: number;
}

const initialState: HistoryState = {
    logs: [],
    unreadCount: 0,
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        logChange: (state, action: PayloadAction<HistoryLog>) => {
            state.logs.unshift(action.payload); // Newest first
            state.unreadCount += 1;
        },
        markRead: (state) => {
            state.unreadCount = 0;
        },
    },
});

export const { logChange, markRead } = historySlice.actions;
export default historySlice.reducer;
