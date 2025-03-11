import { ApiJsonResponce, RegistrationValidationError, UserData } from "../definitions";

export default async function register(
    previousState: {
        msg: string,
        userData: UserData,
        validationErrorsData: RegistrationValidationError,
        responseStatus: number,
        inputValues: any
    },
    formData: FormData
) {
    const state = {
        msg: '',
        userData: {
            userID: 0,
            is_employee: false,
            username: ''
        } as UserData,
        validationErrorsData: {} as RegistrationValidationError,
        responseStatus: 0,
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
        state.responseStatus = res.status;
        const jsonResponse = await res.json() as ApiJsonResponce;
        state.msg = jsonResponse.msg;
        if (res.status === 200) {
            state.userData = jsonResponse.payload as UserData || {
                userID: 0,
                is_employee: false,
                username: ''
            };
        } else if (res.status === 400) {
            state.validationErrorsData = jsonResponse.payload as RegistrationValidationError || {};
        }
        return state;
    } catch (e) {
        state.msg = (e as Error).message;
        state.userData = {
            userID: 0,
            is_employee: false,
            username: ''
        };
        return state;
    }
}