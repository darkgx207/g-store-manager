import { ItemOrderDto } from "./ItemOrderDto";

export class ItemOrder {
  id?: number;
  item_id?: number
  order_id?: number
  price?: number
  amount?: number
  
  public static toItemOrderDto(self: ItemOrder, title: string, isPaid: boolean): ItemOrderDto {
    try {
      return {
        id: self.id!,
        quantity: self.amount!,
        title: title,
        total: self.price!,
        isPaid: isPaid,
        orderId: self.order_id!
      }
    } 
    
    catch { throw Error("Não é possivel mapear para ItemOrder") }
  }
  
  
}
