import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite"
import { Item } from "./models/Item";
import { Alert } from "react-native";
import { getMigrateSql } from "./fakeDataMigration";


export async function initDatabase(db: SQLiteDatabase) {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS items (
            id INTEGER NOT NULL PRIMARY KEY,
            title STRING NOT NULL,
            price FLOAT NOT NULL,
            description TEXT,
            imgUri TEXT,
            sellingUnit TEXT NOT NULL DEFAULT 'Unidade'
        );`
    );
}

export async function initDatabaseTest(db: SQLiteDatabase) {
    try {
        await db.execAsync(
            "DROP TABLE items;" +
            `CREATE TABLE items (
                id INTEGER NOT NULL PRIMARY KEY,
                title STRING NOT NULL,
                price FLOAT NOT NULL,
                description TEXT,
                imgUri TEXT,
                sellingUnit TEXT NOT NULL DEFAULT 'Unidade'
            );` + 
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
            // convertMissingValuesToNull(item);
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

    return { createItem, fetchItems, deleteAllItems, deleteItem, updateItem }
}
