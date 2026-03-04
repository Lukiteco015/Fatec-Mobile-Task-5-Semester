import * as SQLite from 'expo-sqlite'

const DATABASE_NAME = 'task.db'
let database:  SQLite.SQLiteDatabase | null = null

export async function getDatabase(): Promise<SQLite.SQLiteDatabase>{
    if(database !== null) {
        return database
    }

    database = await SQLite.openDatabaseSync(DATABASE_NAME)
    await runMigration(database)
    return database
}

async function runMigration(database: SQLite.SQLiteDatabase) {
    await database.execAsync(
        `PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER NOT NULL,
            createdAt TEXT NOT NULL
        );`
    )
}