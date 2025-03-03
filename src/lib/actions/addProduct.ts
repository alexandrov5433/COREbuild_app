import { ApiJsonResponce, ProductData } from "../definitions";


export default async function addProduct(
    oldState: {
        success: boolean,
        msg: string,
        data: ProductData | null,
        responseStatus: number,
        inputValues: any
    },
    formData: FormData
) {
    const state = {
        success: false,
        msg: oldState.msg,
        data: oldState.data,
        responseStatus: oldState.responseStatus,
        inputValues: oldState.inputValues
    }
    try {
        const inputData = Object.fromEntries(formData.entries());
        console.log(inputData);
        
        state.inputValues = {
            name: inputData?.name || '',
            description: inputData?.description || '',
            price: inputData?.price || '',
            stock: inputData?.stock || '',
            manufacturer: inputData?.manufacturer || ''
        }
        const res = await fetch('/api/add-product', {
            method: 'post',
            body: formData,
            credentials: 'include'
        });
        const data = await res.json() as ApiJsonResponce;
        console.log(data.msg);
        console.log(data.payload);
        
    } catch (e) {
        state.success = false;
        state.msg = (e as Error).message;
        state.data = null;
    } finally {
        return state;
    }
}