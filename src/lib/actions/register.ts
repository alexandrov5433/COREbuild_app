import { ApiJsonResponce, RegistrationValidationError, UserData } from "../definitions";

export default async function register(
    previousState: {
        success: boolean,
        msg: string,
        data: UserData | RegistrationValidationError,
        responseStatus: number,
        inputValues: any
    },
    formData: FormData
) {
    const state = {
        success: previousState.success,
        msg: previousState.msg,
        data: previousState.data,
        responseStatus: previousState.responseStatus,
        inputValues: previousState.inputValues
    }
    try {
        state.inputValues = Object.fromEntries(formData.entries());
        const res = await fetch(`/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData.entries())),
            credentials: "include"
        });
        if (res.status === 200) {
            state.success = true;
            state.responseStatus = 200;
            const data = await res.json() as ApiJsonResponce;
            state.msg = data.msg;
            state.data = data.payload as UserData || {
                userID: 0,
                is_employee: false,
                username: ''
            };
        } else if (res.status === 400) {
            //Invalid registration data.
            state.responseStatus = 400;
            state.success = false;
            const data = await res.json() as ApiJsonResponce;
            state.msg = data.msg;
            state.data = data.payload as RegistrationValidationError;
        } else if (res.status === 500) {
            state.msg = (await res.json() as ApiJsonResponce).msg;
            state.responseStatus = 500;
        }
        // state.trigger = !state.trigger;
        return state;
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        return state;
    }
}