import { ApiJsonResponce, ProductsCatalogActionResponse, ProductsCatalogQueryParams, ProductCatalogPagedResult } from "../definitions";

export default async function productsCatalog(
    queryParams: ProductsCatalogQueryParams
) {
    const actionResponse: ProductsCatalogActionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false,
        pagesCount: 1,
        currentPage: 1,
        urlWithNewQueryParams: ''
    };
    try {
        const urlToFetch = buildUrlFromQueryParams('/api/products-catalog', queryParams);
        console.log('urlToFetch', urlToFetch);
        actionResponse.urlWithNewQueryParams = urlToFetch.slice(4);
        const res = await fetch(urlToFetch, {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        const payload = apiResponse.payload as ProductCatalogPagedResult || null;
        actionResponse.pagesCount = payload.pagesCount || null;
        actionResponse.currentPage = payload.currentPage || null;
        actionResponse.data = payload.products || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
        actionResponse.pagesCount = 1;
        actionResponse.currentPage = 1;
    } finally {
        return actionResponse;
    }
}

function buildUrlFromQueryParams(baseUrl: string, queryParams: ProductsCatalogQueryParams) {
    let newUrl = `${baseUrl}?`;
    [   'currentPage',
        'itemsPerPage',
        'name',
        'category',
        'priceFrom',
        'priceTo',
        'availableInStock',
        'manufacturer',].forEach(key => {
            if (Object.hasOwn(queryParams, key)) {
                newUrl += `${key}=${(queryParams as any)[key]}&`;
            }
        });
    return newUrl;
}