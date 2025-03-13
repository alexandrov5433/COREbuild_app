import { ApiJsonResponce, OrderData, ShoppingCart } from "../definitions";

export default async function placeNewOrder(cartData: ShoppingCart) {
    const actionResponse = {
        status: 0,
        msg: '',
        isError: false,
        data: null
    } as {
        status: number,
        msg: string,
        isError: boolean,
        data: OrderData | null
    };
    try {
        const formData = new FormData();
        formData.append('order', JSON.stringify(cartData));
        const res = await fetch('/api/order', {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        actionResponse.status = res.status;
        const resData = await res.json() as ApiJsonResponce;
        actionResponse.msg = resData.msg;
        actionResponse.data = resData.payload as OrderData || null;
    } catch (e) {
        actionResponse.status = 0;
        actionResponse.msg = (e as Error).message;
        actionResponse.data =  null;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}