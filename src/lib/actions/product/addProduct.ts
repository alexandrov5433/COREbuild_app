import { AddProductState, ApiJsonResponce, ProductData } from "../../definitions";

export default async function addProduct(
    oldState: AddProductState,
    formData: FormData
) {
    const state: AddProductState = {
        success: false,
        msg: '',
        data: null,
        responseStatus: 0,
        inputValues: oldState.inputValues,
        isError: false
    }
    try {
        const inputData = Object.fromEntries(formData.entries());
        state.inputValues = {
            name: inputData?.name as string || '',
            description: inputData?.description as string || '',
            category: inputData?.category as string || '',
            price: inputData?.price as string || '',
            stockCount: inputData?.stockCount as string || '',
            manufacturer: inputData?.manufacturer as string || ''
        }
        const res = await fetch('/api/add-product', {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        const data = await res.json() as ApiJsonResponce;
        if (res.status === 200) {
            state.success = true;
        } else {
            state.success = false;
        }
        state.responseStatus = res.status || 0;
        state.msg = data.msg || '';
        state.data = data.payload as ProductData || null;
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        state.data = null;
        state.isError = true;
    } finally {
        return state;
    }
}