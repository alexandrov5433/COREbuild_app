import { UserData, ApiJsonResponce } from "../definitions";

export default async function login(
    previousState: {
        success: boolean,
        msg: string,
        data: UserData,
        responseStatus: number,
        inputedUsername: string
    },
    formData: FormData
) {
    const state = {
        success: false,
        msg: previousState.msg,
        data: previousState.data,
        responseStatus: previousState.responseStatus,
        inputedUsername: previousState.inputedUsername
    }
    try {
        state.inputedUsername = Object.fromEntries(formData.entries()).username as string || '';
        const res = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username') || '',
                password: formData.get('password') || ''
            }),
            credentials: "include"
        });
        state.responseStatus = res.status;
        if (res.status === 200) {
            state.success = true;
            const newData = await res.json() as ApiJsonResponce;
            state.msg = newData.msg;
            state.data = newData.payload as UserData || {
                userID: 0,
                is_employee: false,
                username: ''
            };
        } else {
            state.msg = (await res.json() as ApiJsonResponce).msg;
            state.data = {
                userID: 0,
                is_employee: false,
                username: 'a',
            };
        }
        return state;
    } catch (e) {
        state.msg = (e as Error).message;
        state.data = {
            userID: 0,
            is_employee: false,
            username: 'a',
        };
        return state;
    }
}