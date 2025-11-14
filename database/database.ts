import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { Item, mapperItemToItemByNumber } from "./models/Item";
import { Alert } from "react-native";
import { getMigrateSql } from "./fakeDataMigration";
import { Order } from "./models/Order";
import { ItemOrder } from "./models/ItemOrder";
import { ItemByNumber } from "@/app/newOrderModal";
import { OrderResume } from "./models/OrderResume";
import { ItemOrderDto } from "./models/ItemOrderDto";
import { ItemsReport } from "./models/Report";


export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS items (
      id INTEGER NOT NULL PRIMARY KEY,
      title STRING NOT NULL,
      price FLOAT NOT NULL,
      description TEXT,
      imgUri TEXT,
      sellingUnit TEXT NOT NULL DEFAULT 'Unidade'
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER NOT NULL PRIMARY KEY,
      createdAt TEXT NOT NULL,
      updatedAt TEXT,
      isPaid BOOLEAN DEFAULT false,
      total FLOAT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS item_order (
      id INTEGER NOT NULL PRIMARY KEY,
      item_id INTEGER NOT NULL REFERENCES items(id),
      order_id INTEGER NOT NULL REFERENCES orders(id),
      price FLOAT NOT NULL DEFAULT 0,
      amount FLOAT NOT NULL
    );`
  );
}

export async function initDatabaseTest(db: SQLiteDatabase) {
    try {
        await db.execAsync(
            "DROP TABLE items;" +
            "DROP TABLE orders;" +
            "DROP TABLE item_order;" +
            `CREATE TABLE items (
              id INTEGER NOT NULL PRIMARY KEY,
              title STRING NOT NULL,
              price FLOAT NOT NULL,
              description TEXT,
              imgUri TEXT,
              sellingUnit TEXT NOT NULL DEFAULT 'Unidade'
            );
            CREATE TABLE orders (
              id INTEGER NOT NULL PRIMARY KEY,
              createdAt TEXT NOT NULL,
              updatedAt TEXT,
              isPaid BOOLEAN DEFAULT false,
              total FLOAT NOT NULL
            );
            CREATE TABLE item_order (
              id INTEGER NOT NULL PRIMARY KEY,
              item_id INTEGER NOT NULL REFERENCES items(id),
              order_id INTEGER NOT NULL REFERENCES orders(id),
              price FLOAT NOT NULL DEFAULT 0,
              amount FLOAT NOT NULL
            );
            ` +
            getMigrateSql() + ";"
        );
    } catch (error) { console.error("Impossivel gerar databaseInitTest", error) }
}

export function useDatabase() {
    const db = useSQLiteContext();

    async function createItem(item: Item) {
        const stmt = await db.prepareAsync(
          'INSERT INTO items (title, price, description, imgUri, sellingUnit) values ($title, $price, $description, $imgUri, $sellingUnit)'
        );
        try {
            const result = await stmt.executeAsync({ $title: item.title, $price: item.price, $description: item.description, $imgUri: item.imgUri, $sellingUnit: item.sellingUnit });
            Alert.alert("","Item registrado com sucesso");
            return result.lastInsertRowId;
        }

        catch (error) { Alert.alert("ALERTA","Ocorreu um erro ao tentar salvar o item"); }
        finally { await stmt.finalizeAsync() }
    }

    async function fetchItems(id?: number) {
        try {
            const sql = id ? `SELECT * FROM items where id=${id}` : 'SELECT * FROM items' ;
            return await db.getAllAsync<Item>(sql) || [];
        }

        catch (error) {
            Alert.alert("ERRO","Não foi possivel obter os registros dos items")
            console.error(error)
            return []
        }
    }

    async function deleteAllItems() {
        try { await db.execAsync('DELETE FROM items'); }

        catch (error) { Alert.alert("ERRO","Não foi possivel obter os registros dos items") }
    }

    async function deleteItem(id: number) {
        const stmt = await db.prepareAsync(`DELETE FROM items where id = ${id}`);
        try {
            return (await stmt.executeAsync()).changes > 0;
        }
        catch (error) { Alert.alert("ERRO","Não foi possivel apagar o item") }
        finally { stmt.finalizeAsync() }
    }

    async function updateItem(item: Item) {
        const stmt = await db.prepareAsync('UPDATE items SET title = $title, price = $price, description = $description, imgUri = $imgUri, sellingUnit = $sellingUnit WHERE id = $id');
        try {
            if (!item.id) throw new Error("[]");
            const res = await stmt.executeAsync({ $title: item.title, $price: item.price, $description: item.description, $imgUri: item.imgUri, $sellingUnit: item.sellingUnit, $id: item.id });
            return res.changes > 0;
        }
        catch (error) { Alert.alert("ERRO", "Não foi possível alterar esse item") }
        finally { await stmt.finalizeAsync(); }
    }

  async function insertItemOrder(orderId: number, item: ItemByNumber) {
    const sql = `INSERT INTO item_order (item_id ,order_id ,price ,amount) values ($itemId, $orderId, $price, $amount)`;
    const stmt = await db.prepareAsync(sql);
    try {
      if (!item.id || !item.quantity) throw Error;
      const res = await stmt.executeAsync({
        $itemId: item.id,
        $orderId: orderId,
        $price: Number((item.price * item.quantity).toFixed(2)),
        $amount: item.quantity
      });
      return Promise.resolve(res.lastInsertRowId);

    } catch (e) {
      console.error(e);
      return Promise.reject(Error("Não foi possivel inserir o item no pedido"));

    } finally {
      await stmt.finalizeAsync();
    }
  }

  function updateItemOrder(orderId: number, item: ItemByNumber) {
    if (!item.quantity)
      return deleteItemOrder(orderId, item);

    const params = {
      itemId: item.id!,
      price: Number((item.price * item.quantity!).toFixed(2)),
      amount: item.quantity!,
      orderId: orderId,
      itemOrderId: item.itemOrderId!
    };

    return params.itemOrderId ? `
    UPDATE item_order
      SET
        item_id = ${params.itemId},
        price = ${params.price},
        amount = ${params.amount}
      WHERE
        id = ${params.itemOrderId} and order_id = ${orderId}
    `: `
    INSERT INTO item_order
      (item_id ,order_id ,price ,amount)
    values
      (${params.itemId}, ${params.orderId}, ${params.price}, ${params.amount})
    `;
  }

  function deleteItemOrder(orderId: number, item: ItemByNumber) {
    return `DELETE FROM item_order WHERE id = ${item.itemOrderId} and order_id = ${orderId}`;
  }



  async function createOrder(order: Order) {
    const sql = 'INSERT INTO orders (isPaid, createdAt, updatedAt, total) values ($isPaid, $createdAt, $updatedAt, $total)';
    let lastId = 0;
    try {
      await db.withTransactionAsync(async () => {
        const now = new Date();
        const res = await db.runAsync(sql, {
          $isPaid: order.isPaid,
          $createdAt: now.toISOString(),
          $updatedAt: now.toISOString(),
          $total: order.total
        });
        if (res.lastInsertRowId == 0) throw Error("Nenhum pedido foi criado");

        for (let item of order.items) {
          const lastId = await insertItemOrder(res.lastInsertRowId, item);
          if (lastId == 0) throw Error("Nenhum item foi adicionado ou pedido");
        }
        lastId = res.lastInsertRowId;
      });
      return Promise.resolve(lastId);
    }
    catch (e) {
      console.error(e);
      Alert.alert("", "[error-db] Não foi possivel criar pedido");
      return Promise.reject(Error("Nào foi possivel criar pedido"))
    }
  }

  async function updateOrder(order: Order) {
    let sql = [];
    for (let item of order.items) {
      sql.push(updateItemOrder(order.id!, item));
    };

    sql.push(`
      UPDATE
        orders
      SET
        isPaid = ${order.isPaid},
        updatedAt = "${new Date().toISOString()}",
        total = ${order.total}
      WHERE
        id = ${order.id}`
    );
    try {
      await db.withTransactionAsync(async () => {
        for (let s of sql) {
          const res = await db.runAsync(s)
        }
      });
      return true;
    }

    catch (e) { Alert.alert("", "[error-db] Não foi possivel, criar pedido"); console.error(e) }
  }

  async function getOrdersSum(start: string, end: string) {
    const sql = `
      SELECT
        SUM(total) as max
      FROM
        orders
      WHERE
        isPaid = true
      AND
        datetime(createdAt) BETWEEN date('${start}') AND date('${end}')
    `;
    return await db.getFirstAsync<number>(sql) || 0;
  }

  async function fetchItemOrder(orderId?: number, onlyPaid?: boolean, period?: { start: Date, end: Date }) {
    let sum = 0;
    try {
      let sql = `SELECT * FROM orders WHERE isPaid = ${onlyPaid || false}`;
      if (orderId) sql += ` AND id = ${orderId}`;
      if (period) {
        const { start, end } = handleDate(period);
        sum = await getOrdersSum(start, end);
        sql += ` AND datetime(createdAt) BETWEEN date('${start}') AND date('${end}')`
      }

      const orders = await db.getAllAsync<OrderResume>(sql);
      await db.withTransactionAsync(async () => {
        for (let order of orders) {
          sql = `SELECT a.*, b.title FROM item_order a INNER JOIN items b ON b.id = a.item_id WHERE order_id = ${order.id!}`;
          const itemOrderDto: ItemOrderDto[] = [];
          const itemsOrder = await db.getAllAsync<Partial<ItemOrder>>(sql);
          itemsOrder.forEach(it => {
            itemOrderDto.push(ItemOrder.toItemOrderDto(it, (it as any).title, order.isPaid));
          });
          order.items = itemOrderDto;
          (order as any).sum = sum;
        }
      });
      return orders;
    }

    catch (e) { Alert.alert("", "[error-db] Não foi possivel consultar pedidos"); console.error(e) }
  }

  function handleDate(period: { start: Date, end: Date }) {
    let start_ = period.start.toISOString();
    let end_ = period.end.toISOString();

    if (start_ == end_) {
      const aux = period.end;
      aux.setDate(aux.getDate() + 1);
      end_ = aux.toISOString();
    }
    return { start: start_, end: end_ };
  }

  async function fetchItemsByOrder(orderId: number, onlyByOrder: boolean) {
    try {
      const sub = `SELECT b.* FROM item_order b INNER JOIN orders c ON c.id = b.order_id WHERE order_id = ${orderId}`;
      const sql = `
        SELECT
          a.*, b.amount, b.id as item_order_id
        FROM
          items a
        LEFT JOIN
          (${sub}) b ON b.item_id = a.id
      `;
      const items = await db.getAllAsync<Partial<Item>>(sql);
      const itemsByNumber: ItemByNumber[] = [];
      items.forEach(it => {
        const x = mapperItemToItemByNumber(it, (it as any).amount, (it as any).item_order_id);
        itemsByNumber.push(x);
      });
      return Promise.resolve(itemsByNumber);
    }
    catch (e) {
      Alert.alert("", "[error-db] Não foi possivel consultar pedidos");
      console.error(e);
      return Promise.reject();
    }
  }


  async function query(s: string) {
    return new Promise<void>(res => {
      db.withExclusiveTransactionAsync(async tx => {
        (await tx.getAllAsync(s)).forEach(s => console.log(JSON.stringify(s, null, 2)));
        res();
      })
    })
  }

  async function reportByPeriod(start: Date, end: Date) {
    let start_ = start.toISOString();
    let end_ = end.toISOString();

    if (start_ == end_) {
      const aux = end;
      aux.setDate(aux.getDate() + 1);
      end_ = aux.toISOString();
    }

    const sql = `
      SELECT
        T1.title as title,
        T1.sellingUnit as un,
        SUM(T3.amount) AS quantity,
        T1.price as price
      FROM items AS T1
      JOIN
        item_order AS T3 ON T1.id = T3.item_id
      JOIN
        orders AS T2 ON T3.order_id = T2.id
      WHERE
        datetime(T2.createdAt) BETWEEN date('${start_}') AND date('${end_}') AND T2.isPaid = true
      GROUP BY
        T1.id, T1.title, T1.sellingUnit
      ORDER BY
        total DESC;
      `;

    const items = await db.getAllAsync<ItemsReport>(sql);
    items.forEach((i, index) => {
      items[index].revenue = ((i.quantity || 0) * (i as any).price);
    })
    return items;
  }

  async function deleteOrder(orderId: number) {
    return new Promise<void>(res => {
      db.withTransactionAsync(async () => {
        try {
          if (!orderId) {
            await db.execAsync('DELETE FROM item_order');
            await db.execAsync('DELETE FROM orders');
            res();
          }
          await db.execAsync(`DELETE FROM item_order WHERE order_id = ${orderId}`);
          await db.execAsync(`DELETE FROM orders WHERE id = ${orderId}`);
          res();
        } catch (e) {
          console.error(e);
          return Promise.reject("Não foi possivel apagar os pedidos")
        }
      });
    })
  }

  async function setOrderAsPaid(orderId: number) {
    let changes = 0;
    await db.withTransactionAsync(async () => {
      const sql = `UPDATE orders SET isPaid = true WHERE id = ${orderId}`;
      const res = await db.runAsync(sql);
      changes = res.changes;
    });
    return changes > 0;
  }

  async function resetDatabase() {
    await db.withTransactionAsync(async () => {
      const sql = `
        DROP TABLE items;
        DROP TABLE orders;
        DROP TABLE item_order;
      `;
      await db.execAsync(sql);
      await initDatabase(db);
    })
  }

  return {
    createItem,
    fetchItems,
    deleteAllItems,
    deleteItem,
    updateItem,
    createOrder,
    fetchItemOrder,
    query,
    updateOrder,
    fetchItemsByOrder,
    deleteOrder,
    reportByPeriod,
    setOrderAsPaid,
    resetDatabase
  }
}
