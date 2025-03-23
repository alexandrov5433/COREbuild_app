import { ApiJsonResponce, ReviewData } from "../../definitions";

export default async function addNewReview(productGenerationData: {
    rating: string,
    comment: string,
    productID: string
}) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | ReviewData,
        isError: boolean   
    };
    try {
        const formData = new FormData();
        formData.append('rating', productGenerationData.rating);
        formData.append('comment', productGenerationData.comment);
        formData.append('productID', productGenerationData.productID);
        const res = await fetch(`/api/review`, {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as ReviewData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}