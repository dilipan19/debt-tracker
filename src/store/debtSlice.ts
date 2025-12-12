import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DebtEntry } from '../types';

interface DebtState {
    items: DebtEntry[];
}

const initialState: DebtState = {
    items: [],
};

const debtSlice = createSlice({
    name: 'debt',
    initialState,
    reducers: {
        addDebt: (state, action: PayloadAction<DebtEntry>) => {
            state.items.push(action.payload);
        },
        updateDebt: (state, action: PayloadAction<DebtEntry>) => {
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteDebt: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        toggleComplete: (state, action: PayloadAction<string>) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                item.completed = !item.completed;
            }
        },
        adjustDebtAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.amount += action.payload.amount;
            }
        },
    },
});

export const { addDebt, updateDebt, deleteDebt, toggleComplete, adjustDebtAmount } = debtSlice.actions;
export default debtSlice.reducer;
