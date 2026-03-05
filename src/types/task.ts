export interface Task {
    id: number
    title: string
    description: string
    completed: number
    createdAt: string
}

export type TaskFilter = 'all' | 'pending' | 'completed'

export interface CreateTaskInput {
    title: string
    description: string
}

export interface UpdateTaskInput {
    title: string
    description: string
    id: number
}