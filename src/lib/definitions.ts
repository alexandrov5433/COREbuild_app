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
    price: number,
    stockCount: number,
    manufacturer: string,
    specsDoc: number,
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
    payload?: UserData | RegistrationValidationError
}

export type RegistrationValidationErrorProperty = {
    valid: boolean,
    msg: string
}

export type RegistrationValidationError = {
    is_employee: RegistrationValidationErrorProperty,
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