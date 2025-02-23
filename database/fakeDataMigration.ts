import { foodsList } from "@/fake-data/foods";


export function getMigrateSql() {

    const sqls = foodsList.map( (item) => {
        let fields: string[] = []
        let values: any[] = []

        Object.entries(item).forEach(subItem => {
            fields.push(subItem[0]);
            if (subItem[0] === "price")
                values.push(subItem[1].replace(',','.'));
            else
                values.push("\'" + subItem[1] + "\'");
        })

        return `INSERT INTO items (${fields.join(", ")}) values (${values.join(", ")})`
    })

    return sqls.join(';')
}