import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../lib/definitions";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userID: 0,
        is_employee: false,
        username: ''
    } as UserData,
    reducers: {
        updateUserData: (state, action: {payload: UserData, type: string}) => {
            state.userID = action.payload.userID;
            state.is_employee = action.payload.is_employee;
            state.username = action.payload.username;
        },
        setUserToGuest: (state) => {
            state.userID = 0;
            state.is_employee = false;
            state.username = '';
        }
    }
});

export const { updateUserData, setUserToGuest } = userSlice.actions;

export default userSlice.reducer;