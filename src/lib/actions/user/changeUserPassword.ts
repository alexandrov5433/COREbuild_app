import { ApiJsonResponce } from "../../definitions";

export default async function changeUserPassword(userID: number | string, formData: FormData) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        isError: boolean  
    };
    try {
        const res = await fetch(`/api/password/${userID}`, {
            method: 'put',
            body: formData,
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}