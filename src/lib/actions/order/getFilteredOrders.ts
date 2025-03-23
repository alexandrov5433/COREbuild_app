import { ApiJsonResponce, OrderData, OrderFiltrationOptions } from "../../definitions";

type FilteredOrdersData = {
    pagesCount: number,
    currentPage: number,
    orders: Array<OrderData>
}
export default async function getFilteredOrders(filtrationOptions: OrderFiltrationOptions) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | FilteredOrdersData,
        isError: boolean   
    };
    try {
        const res = await fetch(buildURL('/api/filtered-orders', filtrationOptions), {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as FilteredOrdersData || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}

function buildURL(baseUrl: string, filtrationOptions: OrderFiltrationOptions) {
    let newUrl = `${baseUrl}?`;
    [   
        'orderID',
        'recipientID',
        'shipping_status',
        'time',
        'currentPage',
        'itemsPerPage'
    ].forEach(key => {
            if (Object.hasOwn(filtrationOptions, key)) {
                newUrl += `${key}=${(filtrationOptions as any)[key]}&`;
            }
        });
    return newUrl;
}