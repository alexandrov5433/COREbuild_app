import { ApiJsonResponce, FavoriteData } from "../../definitions";

export default async function addProductToFavorite(userID: number | string, productID: number | string) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | FavoriteData,
        isError: boolean   
    };
    try {
        const res = await fetch(`/api/favorite/${userID}/${productID}`, {
            method: 'post',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as FavoriteData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}