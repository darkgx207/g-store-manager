
export interface ItemOrderDto {
  id: number
  quantity?: number
  title: string,
  total: number,
  isPaid: boolean,
  orderId: number
}
