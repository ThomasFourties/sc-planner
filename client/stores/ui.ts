import { defineStore } from 'pinia';

interface UIState {
  showTaskForm: boolean;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    showTaskForm: false,
  }),

  getters: {
    isTaskFormVisible: (state) => state.showTaskForm,
  },

  actions: {
    openTaskForm() {
      this.showTaskForm = true;
    },

    closeTaskForm() {
      this.showTaskForm = false;
    },

    toggleTaskForm() {
      this.showTaskForm = !this.showTaskForm;
    },
  },
}); 