export type UserData = {
    userID: number,
    is_employee: boolean,
    username: string,
    email?: string | null,
    firstname?: string | null,
    lastname?: string | null,
    prefered_payment_method?: 'paypal' | 'bank' | null,
    address?: string | null,
    favorite_products?: Array<number>,
    past_purchases?: Array<number>
}

export type ProductData = {
    productID: number,
    name: string,
    description: string,
    category: string,
    price: number,
    stockCount: number,
    manufacturer: string,
    specsDocID: number,
    thumbnailID: number,
    pictures: Array<number>,
    reviews: Array<number>
}

export type ReviewData = {
    reviewID: number,
    rating: number,
    comment: string,
    reviewerID: number,
    time: bigint
}

export type FileData = {
    fileID: number,
    name: string
}

export type ApiJsonResponce = {
    msg: string,
    payload?: UserData | RegistrationValidationError | ProductData | ProductCatalogPagedResult
}

export type RegistrationValidationErrorProperty = {
    valid: boolean,
    msg: string
}

export type RegistrationValidationError = {
    // is_employee: RegistrationValidationErrorProperty,
    username: RegistrationValidationErrorProperty,
    password: RegistrationValidationErrorProperty,
    repeat_password: RegistrationValidationErrorProperty,
    authentication_code?: RegistrationValidationErrorProperty,
    email?: RegistrationValidationErrorProperty,
    firstname?: RegistrationValidationErrorProperty,
    lastname?: RegistrationValidationErrorProperty,
    prefered_payment_method?: RegistrationValidationErrorProperty,
    address?: RegistrationValidationErrorProperty,
}

export type MessageData = {
    isShown: boolean,
    text: string,
    type: 'success' | 'error' | 'neutral',
    duration: number
}

export type AddProductState = {
    success: boolean,
    msg: string,
    data: ProductData | null,
    responseStatus: number,
    inputValues: {
        name: string,
        description: string,
        category: string,
        price: string,
        stockCount: string,
        manufacturer: string
    },
    isError: boolean
}

export type ProductsCatalogQueryParams = {
    currentPage: number,
    itemsPerPage: number,
    name?: string,
    category?: string,
    priceFrom?: string,
    priceTo?: string,
    availableInStock?: string,
    manufacturer?: string,
}

export type ProductsCatalogActionResponse = {
    msg: string,
    responseStatus: number,
    data: Array<ProductData> | null,
    isError: boolean,
    pagesCount: number | null,
    currentPage: number | null,
    urlWithNewQueryParams: string
}

export type ProductCatalogPagedResult = {
    pagesCount: number,
    currentPage: number,
    products: Array<ProductData>
}

export type ProductInCart = {
    productID: number;
    count: number;
}

export type ProductDetailsActionResponse = {
    msg: string,
    responseStatus: number,
    data: null | ProductData,
    isError: boolean
}