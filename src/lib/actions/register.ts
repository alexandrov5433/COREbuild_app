import { ApiJsonResponce, RegistrationValidationError, UserData } from "../definitions";


export default async function register(
    state: {
        success: boolean,
        msg: string,
        data: UserData | RegistrationValidationError,
        responseStatus: number,
        trigger: boolean,
        inputValues: any
    },
    formData: FormData
) {
    try {
        console.log('Object.fromEntries(formData.entries())', Object.fromEntries(formData.entries()));
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
            const data = JSON.parse(await res.json()) as ApiJsonResponce;
            state.msg = data.msg;
            state.data = data.payload as UserData || {
                userID: 0,
                is_employee: false,
                username: ''
            };
            state.responseStatus = 200;
        } else if (res.status === 400) {
            //Invalid registration data.
            state.success = false;
            const data = JSON.parse(await res.json()) as ApiJsonResponce;
            state.msg = data.msg;
            state.data = data.payload as RegistrationValidationError;
            state.responseStatus = 400;
        } else if (res.status === 500) {
            state.msg = (await res.json() as ApiJsonResponce).msg;
            state.responseStatus = 500;
        }
        state.trigger = !state.trigger;
        return state;
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        return state;
    }
}