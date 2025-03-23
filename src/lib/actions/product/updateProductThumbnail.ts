import { ApiJsonResponce } from "../definitions";

export default async function updateProductThumbnail(productID: string, thumbnailFile: File) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | boolean,
        isError: boolean   
    };
    try {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);
        const res = await fetch(`/api/update-product-thumbnail/${productID}`, {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as boolean || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}