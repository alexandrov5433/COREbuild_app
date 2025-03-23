import { ApiJsonResponce, CollectPaymentActionData } from "../definitions";

export default async function collectPayment(paypalOrderID: string) {
    const actionResponse = {
        status: 0,
        msg: '',
        isError: false,
        data: null
    } as {
        status: number,
        msg: string,
        isError: boolean,
        data: CollectPaymentActionData | null
    };
    try {
        const res = await fetch(`/api/collect-payment/${paypalOrderID}`, {
            method: 'get',
            credentials: 'include'
        });
        actionResponse.status = res.status;
        const resData = await res.json() as ApiJsonResponce;
        actionResponse.msg = resData.msg;
        actionResponse.data = resData.payload as CollectPaymentActionData || null;
    } catch (e) {
        actionResponse.status = 0;
        actionResponse.msg = (e as Error).message;
        actionResponse.data =  null;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}