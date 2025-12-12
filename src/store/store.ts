import { configureStore } from '@reduxjs/toolkit';
import debtReducer from './debtSlice';
import historyReducer from './historySlice';

export const store = configureStore({
    reducer: {
        debt: debtReducer,
        history: historyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
