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
    },
});

export const { addDebt, updateDebt, deleteDebt } = debtSlice.actions;
export default debtSlice.reducer;
