import { ApiJsonResponce, GetRatingAndReviewCountForProductActionData } from "../definitions";

export default async function getRatingAndReviewCountForProduct(productID: string) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | GetRatingAndReviewCountForProductActionData,
        isError: boolean   
    };
    try {
        const res = await fetch(`/api/rating-and-review-count/${productID}`, {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as GetRatingAndReviewCountForProductActionData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}