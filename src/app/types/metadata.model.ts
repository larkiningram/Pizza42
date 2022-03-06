export interface MetadataModel {
    orders: Array<OrderModel>
}

export interface OrderModel {
    //time
    size: string;
    quantity: string;
    acceptTerms: boolean;
}
