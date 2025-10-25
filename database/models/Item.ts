import { UnidadeVendas } from "@/constants/constantValues"

export interface Item {
    id?: number,
    title: string,
    price: number,
    description: string,
    imgUri: string,
    sellingUnit: (typeof UnidadeVendas)[keyof typeof UnidadeVendas]
}
