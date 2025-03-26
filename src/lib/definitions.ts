export type UserData = {
    userID: number,
    is_employee: boolean,
    username: string,
    email?: string | null,
    firstname?: string | null,
    lastname?: string | null,
    address?: string | null,
    favorite_products?: Array<number>,
    shopping_cart: ShoppingCart
}

export type ProductData = {
    productID: number,
    name: string,
    description: string,
    category: string,
    price: number,
    stockCount: number,
    manufacturer: string,
    specsDocID: number | null,
    thumbnailID: number,
    pictures: Array<number>
}

export type ReviewData = {
    reviewID: number,
    rating: number,
    comment: string,
    reviewerID: number,
    username?: string,
    time: bigint,
    isVerifiedPurchase: boolean,
    productID: number
}

export type GetReviewsForProductActionData = {
    pagesCount: number,
    currentPage: number,
    reviews: Array<ReviewData>
}

export type GetRatingAndReviewCountForProductActionData = {
    rating: number,
    reviewsCount: number
}

export type FileData = {
    fileID: number,
    name: string
}

export type ApiJsonResponce = {
    msg: string,
    payload?: UserData | RegistrationValidationError | ProductData | ProductCatalogPagedResult | ShoppingCart | string | CollectPaymentActionData | GetReviewsForProductActionData | boolean | Array<string> | FavoriteData | Array<ProductData | null>
}

export type RegistrationValidationErrorProperty = {
    valid: boolean,
    touched: boolean,
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

export type ShoppingCart = {
    [key: number]: number
}

export type ProductDetailsActionResponse = {
    msg: string,
    responseStatus: number,
    data: null | ProductData,
    isError: boolean
}

export type OrderData = {
    id?: number,
    payment_status: 'pending' | 'paid',
    shipping_status: 'pending' | 'sent',
    content: ShoppingCart,
    recipient: UserData['userID'],
    placement_time: number,
    total_price: number,
    paypal_order_id: string,
    shipping_speditor: string | null,
    shipment_tracking_code: string | null
}

export type OrderFiltrationOptions = {
    orderID: number | null,
    recipientID: number | null,
    shipping_status: 'pending' | 'shipped' | null,
    time: 'ascending' | 'descending' | null,
    currentPage: number,
    itemsPerPage: number
};

export type CollectPaymentActionData = {
    updatedOrderData: OrderData,
    userData: UserData
}

export type FavoriteData = {
    id: number,
    userID: number,
    products: Array<number>
}