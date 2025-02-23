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
            imgUri TEXT
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
                imgUri TEXT
            );` + 
            getMigrateSql() + ";"
        );

    } catch (error) { console.error("Impossivel gerar databaseInitTest", error) }
}


// function convertMissingValuesToNull(object: Record<string, any>) {
//     for (const key in object) {
//         if (object[key] === "") object[key] = "NULL";
//     }
// }


export function useDatabase() {
    const db = useSQLiteContext();

    async function createItem(item: Item) {
        const stmt = await db.prepareAsync('INSERT INTO items (title, price, description, imgUri) values ($title, $price, $description, $imgUri)');
        try {
            // convertMissingValuesToNull(item);
            const result = await stmt.executeAsync({ $title: item.title, $price: item.price, $description: item.description, $imgUri: item.imgUri});
            Alert.alert("","Item registrado com sucesso");
            return result.lastInsertRowId;
        }

        catch (error) { Alert.alert("ALERTA","Ocorreu um erro ao tentar salvar o item"); } 
        finally { await stmt.finalizeAsync() }
    }

    async function fetchItems() {
        try { 
            return await db.getAllAsync<Item>('SELECT * FROM items') || [];
        } 
        
        catch (error) { 
            Alert.alert("ERRO","Não foi possivel obter os registros dos items") 
            return []
        }
    }

    async function deleteAllItems() {
        try { await db.execAsync('DELETE FROM items'); }

        catch (error) { Alert.alert("ERRO","Não foi possivel obter os registros dos items") }
    }

    return { createItem, fetchItems, deleteAllItems }
}
