import { ItemOrderDto } from "./ItemOrderDto"

export interface OrderResume {
  id?: number
  items?: ItemOrderDto[],
  isPaid: boolean,
  createdAt?: Date,
  updatedAt?: Date,
  total: number
}
