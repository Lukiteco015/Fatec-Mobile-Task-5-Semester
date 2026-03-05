import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as taskRepository from '../database/taskRepository';
import { TaskFilter, Task } from "../types/task";

interface UseTaskReturn {
    tasks: Task[]
    allTasksCount: number
    pendingTasksCount: number
    completedTasksCount: number
    filter: TaskFilter
    loading: boolean
    setFilter: (filter: TaskFilter) => void
    toggleTask: (id: number, currentCompleted: number) => Promise<void>
    deleteTask: (id: number) => Promise<void>
}

export function useTasks(): UseTaskReturn {
    const [tasks, setTasks] = useState<Task[]>([])
    const [filter, setFilter] = useState<TaskFilter>('all')
    const [loading, setLoading] = useState(true)

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true)
            const data = await taskRepository.getTasks()
            setTasks(data);
        } catch(error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            loadTasks()
        }, [loadTasks])
    )
    
    const filteredTasks = tasks.filter(task => {
        if (filter == 'pending') return task.completed == 0
        if (filter == 'completed') return task.completed == 1
        return true
    })

    const pendingTasksCount = tasks.filter(task => task.completed == 0).length
    const completedTasksCount = tasks.filter(task => task.completed == 1).length

    const toggleTask = useCallback(
        async (id: number, currentCompleted: number) => {
            try {
                const newCompleted = currentCompleted == 0 ? 1 : 0
                await taskRepository.toggleTaskCompleted(id, newCompleted)
                await loadTasks()
            } catch (error) {
                console.log(error)
            }
        }, [loadTasks]
    )

    const deleteTask = useCallback(
    async (id: number) => {
      await taskRepository.deleteTask(id);
      await loadTasks();
    },
    [loadTasks],
    );

     return {
    tasks: filteredTasks,
    allTasksCount: tasks.length,
    pendingTasksCount: tasks.filter((t) => t.completed === 0).length,
    completedTasksCount: tasks.filter((t) => t.completed === 1).length,
    filter,
    loading,
    setFilter,
    toggleTask,
    deleteTask
  };
}