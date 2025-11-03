import { ItemByNumber } from "@/app/newOrderModal";

export interface Order {
    id?: number
    items: ItemByNumber[],
    isPaid: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    total: number
}
