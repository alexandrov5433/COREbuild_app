import { createSlice } from "@reduxjs/toolkit";
import { ProductInCart } from "../lib/definitions";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: [] as Array<ProductInCart>,
    reducers: {
        addProductToCart: (state, action: {payload: ProductInCart, type: string}) => {
            state.push(action.payload);
        },
        removeProductFromCart: (state, action: {payload: ProductInCart, type: string}) => {
            state.filter(p => p.productID != action.payload.productID);
        },
        emptyCart: (state) => {
            state = [];
        }
    }
});

export const { addProductToCart, removeProductFromCart } = cartSlice.actions;

export default cartSlice.reducer;