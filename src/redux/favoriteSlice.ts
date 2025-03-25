import { createSlice } from "@reduxjs/toolkit";
import { FavoriteData } from "../lib/definitions";

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {} as FavoriteData,
    reducers: {
        updateFavorite: (_state, action: {payload: FavoriteData, type: string}) => {
            return action.payload;
        }
    }
});

export const { updateFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;