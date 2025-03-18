import { ApiJsonResponce } from "../definitions";

export default async function cancelOrder(paypalOrderID: string) {
    const actionResponse = {
        status: 0,
        msg: '',
        isError: false
    } as {
        status: number,
        msg: string,
        isError: boolean
    };
    try {
        const res = await fetch(`/api/cancel-payment/${paypalOrderID}`, {
            method: 'get',
            credentials: 'include'
        });
        actionResponse.status = res.status;
        const resData = await res.json() as ApiJsonResponce;
        actionResponse.msg = resData.msg;
    } catch (e) {
        actionResponse.status = 0;
        actionResponse.msg = (e as Error).message;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}