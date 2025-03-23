import { ApiJsonResponce } from "../../definitions";

export default async function logout() {
    const state = {
        success: false,
        msg: ''
    }
    try {
        const res = await fetch(`/api/logout`, {
            credentials: "include"
        });
        if (res.status === 200) {
            state.success = true;
        } else {
            state.success = false;
        }
        state.msg = (await res.json() as ApiJsonResponce).msg;
        return state;
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        return state;
    }
}