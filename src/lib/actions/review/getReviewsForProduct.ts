import { ApiJsonResponce, GetReviewsForProductActionData } from "../definitions";

export default async function getReviewsForProduct(productID: string, currentPage: number) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | GetReviewsForProductActionData,
        isError: boolean   
    };
    try {
        const res = await fetch(`/api/product-reviews?productID=${productID}&currentPage=${currentPage}`, {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as GetReviewsForProductActionData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}