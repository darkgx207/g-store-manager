import { ItemByNumber } from "@/app/newOrderModal";
import { UnidadeVendas } from "@/constants/constantValues"

export interface Item {
    id?: number,
    title: string,
    price: number,
    description: string,
    imgUri: string,
    sellingUnit: (typeof UnidadeVendas)[keyof typeof UnidadeVendas]
}

export function mapperItemToItemByNumber(item: Partial<Item>, quantity: number, itemOrderId: number): ItemByNumber {
  return {
    quantity: quantity,
    description: item.description!,
    imgUri: item.imgUri!,
    price: item.price!,
    sellingUnit: item.sellingUnit!,
    title: item.title!,
    id: item.id,
    itemOrderId
  };
  
}
