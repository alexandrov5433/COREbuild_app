import { ApiJsonResponce, UserData } from "../definitions";

export default async function validateCoookie() {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null
    } as {
        msg: string,
        responseStatus: number,
        data: null | UserData
    };
    try {
        const res = await fetch('/api/validate-cookie', {
            method: 'get',
            credentials: "include"
        });
        actionResponse.responseStatus = res.status || 400;
        const result = await res.json() as ApiJsonResponce;
        actionResponse.msg = result.msg || 'Something went wrong.';
        actionResponse.data = result.payload as UserData || {
            userID: 0,
            is_employee: false,
            username: ''
        };
    } catch (e) {
        actionResponse.msg = (e as Error).message || 'Something went wrong.';
        actionResponse.data = null;
        actionResponse.responseStatus = 0;
    } finally {
        return actionResponse;
    }
}