import { UserData, ApiJsonResponce } from "../definitions";

export default async function loginAction(
    state: {
        success: boolean,
        msg: string,
        data: UserData
    },
    formData: FormData
) {
    try {

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
        if (res.status === 200) {
            state.success = true;
            const newData = await res.json() as ApiJsonResponce;
            state.msg = newData.msg;
            state.data = newData.payload || {
                userID: 0,
                is_employee: false,
                username: ''
            };
        } else {
            state.success = false;
            state.msg = (await res.json() as ApiJsonResponce).msg;
        }
        return state;
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        return state;
    }
}