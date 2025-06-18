interface Task {
  id: string;
  name: string;
  description?: string;
  duration: number;
  assigned_to_id?: string;
  created_by_id: string;
  start_date?: Date;
  end_date?: Date;
  status: 'not_started' | 'in_progress' | 'done' | 'todo' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  dependency_id?: string;
  created_at: Date;
  updated_at: Date;
  assigned_to?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_by?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  dependency?: Task;
}

export const useTasks = () => {
  const authStore = useAuthStore();

  const getAssignedTasks = async (): Promise<Task[]> => {
    try {
      const response = await $fetch('/api/tasks/assigned-to-me', {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      });

      return response as Task[];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tâches assignées:', error);
      throw error;
    }
  };

  const getAllTasks = async (): Promise<Task[]> => {
    try {
      const response = await $fetch('/api/tasks/tasks', {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response as Task[];
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les tâches:', error);
      throw error;
    }
  };

  const createTask = async (taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const response = await $fetch('/api/tasks/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: taskData,
      });
      return response as Task;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  };

  return {
    getAssignedTasks,
    getAllTasks,
    createTask,
  };
};
