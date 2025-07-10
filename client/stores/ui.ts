import { defineStore } from 'pinia';

interface UIState {
  showTaskForm: boolean;
  editingTask: any | null;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    showTaskForm: false,
    editingTask: null,
  }),

  getters: {
    isTaskFormVisible: (state) => state.showTaskForm,
    isEditing: (state) => !!state.editingTask,
    currentTask: (state) => state.editingTask,
  },

  actions: {
    openTaskForm() {
      this.showTaskForm = true;
      this.editingTask = null;
    },

    openTaskEdit(task: any) {
      this.showTaskForm = true;
      this.editingTask = task;
    },

    closeTaskForm() {
      this.showTaskForm = false;
      this.editingTask = null;
    },

    toggleTaskForm() {
      if (this.showTaskForm) {
        this.closeTaskForm();
      } else {
        this.openTaskForm();
      }
    },
  },
}); 