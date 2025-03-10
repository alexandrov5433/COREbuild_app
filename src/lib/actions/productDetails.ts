import { ApiJsonResponce, ProductData, ProductDetailsActionResponse } from "../definitions";

export default async function productDetails(productID: number) {
    const actionResponse: ProductDetailsActionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    };
    try {
        const res = await fetch(`/api/product-details/${productID}`, {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as ProductData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}