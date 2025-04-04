import { createSlice } from "@reduxjs/toolkit";
import { ShoppingCart } from "../lib/definitions";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {} as ShoppingCart,
    reducers: {
        updateCart: (_state, action: {payload: ShoppingCart, type: string}) => {
            return action.payload;
        },
        emptyCart: (_state) => {
            return {};
        }
    }
});

export const { updateCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;