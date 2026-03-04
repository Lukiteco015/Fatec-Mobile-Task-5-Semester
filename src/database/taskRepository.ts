import { CreateTaskInput, UpdateTaskInput } from "../types/task";
import { getDatabase } from "./database";
import { Task } from "react-native";

export async function getTasks(): Promise<Task[]> {
    const db = await getDatabase()
    return db.getAllAsync<Task>(`SELECT * FROM tasks ORDER BY createdAt DESC`)
}

export async function getTaskById(id:number): Promise<Task | null> {
    const database = await getDatabase()
    return database.getFirstAsync<Task>(
        `SELECT * FROM tasks WHERE id = ?`, [id])
}

export async function createTask(input:CreateTaskInput): Promise<Task> {
    const database = await getDatabase()
    const createdAt = new Date().toISOString()
    const result = await database.runAsync(
        `INSERT INTO tasks (title, description, completed, createdAt) VALUES (?,?,?,?)`,
        [input.title, input.description, 0, createdAt]
    )
    return await (await getTaskById(result.lastInsertRowId))!
}

export async function updateTask(input:UpdateTaskInput) {
    const database = await getDatabase()
    await database.runAsync(
        `UPDATE tasks
        SET title = ?, description = ?
        where id = ?`,
        [input.title, input.description, input.id]
    )    
}

export async function toggleTaskCompleted(id: number, completed: number) {
    const database = await getDatabase()
    await database.runAsync(
        `UPDATE tasks
        set completedAt = ?
        WHERE id = ?`, [completed, id]
    )
}

export async function deleteTask(id:number) {
    const database = await getDatabase()
    await database.runAsync(
        `DELETE FROM tasks
        WHERE id = ?`, [id]
    )
}