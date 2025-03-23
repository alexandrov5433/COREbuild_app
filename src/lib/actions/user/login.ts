import { UserData, ApiJsonResponce } from "../../definitions";

export default async function login(
    previousState: {
        msg: string,
        data: UserData | null,
        responseStatus: number,
        inputedUsername: string
    },
    formData: FormData
) {
    const state = {
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
                password: formData.get('password') || '',
                stayLoggedIn: formData.get('stayLoggedIn') || ''
            }),
            credentials: "include"
        });
        state.responseStatus = res.status;
        const newData = await res.json() as ApiJsonResponce;
        state.msg = newData.msg;
        state.data = newData.payload as UserData || null;
    } catch (e) {
        state.msg = (e as Error).message;
        state.data = null;
    } finally {
        return state;
    }
}