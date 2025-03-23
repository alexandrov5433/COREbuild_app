import { ApiJsonResponce, ShoppingCart } from "../../definitions";

export default async function removeProductFromCart(productID: number, count: number) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | ShoppingCart,
        isError: boolean   
    };
    try {
        const formData = new FormData();
        formData.append('productID', productID.toString());
        formData.append('count', count.toString());
        const res = await fetch(`/api/cart/remove`, {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as ShoppingCart || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}