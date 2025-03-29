import { ApiJsonResponce, GetFilteredTicketsResponseData, TicketFiltrationOptions } from "../../definitions";

export default async function getFilteredTickets(filtraionOptions: TicketFiltrationOptions) {
    const actionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    } as {
        msg: string,
        responseStatus: number,
        data: null | GetFilteredTicketsResponseData,
        isError: boolean   
    };
    try {
        const res = await fetch(buildURL('/api/ticket-filter', filtraionOptions), {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as GetFilteredTicketsResponseData || [];
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}

function buildURL(baseUrl: string, filtrationOptions: TicketFiltrationOptions) {
    let newUrl = `${baseUrl}?`;
    [   
        'id',
        'status',
        'time_open',
        'currentPage',
        'itemsPerPage'
    ].forEach(key => {
            if (Object.hasOwn(filtrationOptions, key)) {
                if ((filtrationOptions as any)[key] != null) {
                    newUrl += `${key}=${(filtrationOptions as any)[key]}&`;
                }
            }
        });
    return newUrl;
}