import { ApiJsonResponce, ProductData, ProductsCatalogActionResponse, ProductsCatalogQueryParams } from "../definitions";

export default async function productsCatalog(
    queryParams: ProductsCatalogQueryParams
) {
    const actionResponse: ProductsCatalogActionResponse = {
        msg: '',
        responseStatus: 0,
        data: null,
        isError: false
    };
    try {
        const urlToFetch = buildUrlFromQueryParams('/api/products-catalog', queryParams);
        console.log('urlToFetch', urlToFetch);

        const res = await fetch(urlToFetch, {
            method: 'get',
            credentials: 'include'
        });
        const apiResponse = await res.json() as ApiJsonResponce;
        actionResponse.responseStatus = res.status || 0;
        actionResponse.msg = apiResponse.msg || '';
        actionResponse.data = apiResponse.payload as Array<ProductData> || null;
    } catch (e) {
        actionResponse.msg = (e as Error).message;
        actionResponse.responseStatus = 0;
        actionResponse.isError = true;
    } finally {
        return actionResponse;
    }
}

function buildUrlFromQueryParams(baseUrl: string, queryParams: ProductsCatalogQueryParams) {
    let newUrl = `${baseUrl}?`;
    ['name',
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