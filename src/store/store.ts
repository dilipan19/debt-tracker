import { configureStore, combineReducers } from '@reduxjs/toolkit';
import debtReducer from './debtSlice';
import historyReducer from './historySlice';
import { loadState, saveState } from './localStorage';

const preloadedState = loadState();

const rootReducer = combineReducers({
    debt: debtReducer,
    history: historyReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
});

store.subscribe(() => {
    saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
