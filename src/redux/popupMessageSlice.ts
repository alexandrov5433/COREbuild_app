import { createSlice } from "@reduxjs/toolkit";
import { MessageData } from "../lib/definitions";

interface InitialState extends MessageData { trigger: boolean };

export const popupMessageSlice = createSlice({
    name: 'popupMessage',
    initialState: {
        trigger: false,
        isShown: false,
        text: '',
        type: 'success',
        duration: 0
    } as InitialState,
    reducers: {
        setMessageData: (state, action: { payload: MessageData, type: string }) => {
            state.trigger = !state.trigger,
            state.isShown = action.payload.isShown,
            state.text = action.payload.text,
            state.type = action.payload.type,
            state.duration = action.payload.duration
        }
    }
});

export const { setMessageData } = popupMessageSlice.actions;

export default popupMessageSlice.reducer;