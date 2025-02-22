import { createSlice } from "@reduxjs/toolkit";
// import { UserData } from "../lib/definitions";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: 'guest',
        password: ''
    } as UserData,
    reducers: {
        updateUser: (state, action: {payload: UserData, type: string}) => {
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
        setUserToGuest: (state) => {
            state.username = 'guest';
            state.password = '';
        }
    }
});

export const { updateUser, setUserToGuest } = userSlice.actions;

export default userSlice.reducer;