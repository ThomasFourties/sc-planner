<template>
  <div class="tasks">
    <div class="tasks-content">
      <div class="tasks-controls">
        <button class="add-task-btn">
          <span class="plus-icon">+</span>
          Ajouter une tâche
        </button>

        <div class="filter-controls">
          <button class="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z"
                stroke="currentColor" stroke-width="2" />
            </svg>
            Filtrer
          </button>

          <button class="sort-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M7 12H17M11 18H13" stroke="currentColor" stroke-width="2" />
            </svg>
            Trier
          </button>
        </div>
      </div>

      <div class="tasks-table-container">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>Nom de la tâche</th>
              <th>Statut</th>
              <th>Créé par</th>
              <th>Créé le</th>
              <th>À faire le</th>
              <th>Projets</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task.id" class="task-row" @click="openTaskDetail(task)">
              <td class="task-name">
                <div class="task-info">
                  <span class="task-icon">⚫</span>
                  {{ task.name }}
                </div>
              </td>
              <td class="task-status">
                <span class="status-badge" :class="getStatusClass(task.status)">
                  {{ getStatusLabel(task.status) }}
                </span>
              </td>
              <td class="task-creator">
                {{ task.created_by ? `${task.created_by.first_name} ${task.created_by.last_name}` : 'Non défini' }}
              </td>
              <td class="task-created">
                {{ formatDate(task.created_at) }}
              </td>
              <td class="task-due">
                {{ task.start_date ? formatDate(task.start_date) : formatDate(task.created_at) }}
              </td>
              <td class="task-project">
                <span class="project-badge" :style="{ backgroundColor: getProjectColor() }">
                  {{ getProjectName() }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredTasks.length === 0" class="empty-state">
          <p>Aucune tâche trouvée</p>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Chargement des tâches...</p>
        </div>
      </div>
    </div>

    <!-- Modal de détail de tâche -->
    <Modal :isOpen="showTaskDetail" @close="closeTaskDetail">
      <template #header>
        <h2>Visualisation de la tâche</h2>
      </template>
      <TaskDetailPanel 
        v-if="selectedTask"
        :task="selectedTask"
        @save="saveTaskChanges"
        @close="closeTaskDetail"
      />
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTasks } from '~/composables/useTasks'
import { useAuthStore } from '~/stores/auth'
import Modal from '~/components/base/Modal.vue'
import TaskDetailPanel from '~/components/TaskDetailPanel.vue'

definePageMeta({
  middleware: 'auth'
})

const { getAllTasks } = useTasks()
const authStore = useAuthStore()

const tasks = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const showTaskDetail = ref(false)
const selectedTask = ref(null)
let refreshInterval = null

// Mapping des statuts
const statusMapping = {
  'todo': 'À faire',
  'not_started': 'À faire',
  'in_progress': 'En cours',
  'blocked': 'Bloqué',
  'done': 'Terminé'
}

// Couleurs des projets (exemples)
const projectColors = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#84CC16', '#F97316'
]

// Noms de projets temporaires
const projectNames = [
  'EURECIA', 'HELLO ASSO', 'TFC', 'SUPERCOLOR',
  'THE SEA CLEANERS', 'LA CÔTE ET L\'ARÊTE', 'TDS', 'VOLFONI'
]

// Fonctions utilitaires
const getStatusLabel = (status) => {
  return statusMapping[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'todo': 'status-todo',
    'not_started': 'status-todo',
    'in_progress': 'status-progress',
    'blocked': 'status-blocked',
    'done': 'status-done'
  }
  return classMap[status] || 'status-todo'
}

const getProjectColor = () => {
  return projectColors[Math.floor(Math.random() * projectColors.length)]
}

const getProjectName = () => {
  return projectNames[Math.floor(Math.random() * projectNames.length)]
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non défini'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Filtrage des tâches
const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasks.value

  return tasks.value.filter(task =>
    task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    getStatusLabel(task.status).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (task.created_by &&
      `${task.created_by.first_name} ${task.created_by.last_name}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

// Récupération des tâches
const fetchTasks = async () => {
  if (!authStore.token) return

  try {
    const fetchedTasks = await getAllTasks()
    tasks.value = fetchedTasks
    isLoading.value = false
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error)
    isLoading.value = false
  }
}

// Auto-refresh
const startAutoRefresh = () => {
  refreshInterval = setInterval(() => {
    fetchTasks()
  }, 30000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Lifecycle
onMounted(() => {
  const tasksLink = document.querySelector('.tasks.nav-link')
  if (tasksLink) {
    tasksLink.classList.add('active')
  }

  fetchTasks()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

// Fonctions pour le modal de détail
const openTaskDetail = (task) => {
  selectedTask.value = task
  showTaskDetail.value = true
}

const closeTaskDetail = () => {
  showTaskDetail.value = false
  selectedTask.value = null
}

const saveTaskChanges = async (updatedTask) => {
  try {
    // TODO: Appeler l'API pour sauvegarder les changements
    console.log('Sauvegarde de la tâche:', updatedTask)
    
    // Mettre à jour la tâche dans la liste locale
    const taskIndex = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updatedTask }
    }
    
    closeTaskDetail()
    
    // Rafraîchir les données
    await fetchTasks()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;

.tasks-header {
  margin-bottom: 32px;
}

.search-container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
}

.tasks-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tasks-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
}

.plus-icon {
  font-size: 18px;
  line-height: 1;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-btn,
.sort-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
  }
}

.tasks-table-container {
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 16px 24px;
    font-weight: 500;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    background-color: #f8fafc;
    font-size: 14px;
  }

  td {
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
}

.task-row {
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8fafc;
  }
}

.task-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-icon {
  font-size: 8px;
  color: #64748b;
}

.task-name {
  font-weight: 500;
  color: #1e293b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;

  &.status-todo {
    background-color: #fef3c7;
    color: #92400e;
  }

  &.status-progress {
    background-color: #dbeafe;
    color: #1e40af;
  }

  &.status-blocked {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &.status-done {
    background-color: #d1fae5;
    color: #065f46;
  }
}

.task-creator,
.task-created,
.task-due {
  color: #64748b;
  font-size: 14px;
}

.project-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
}

@media (max-width: 768px) {
  .tasks {
    padding: 16px;
  }

  .tasks-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filter-controls {
    justify-content: center;
  }

  .tasks-table {
    font-size: 14px;

    th,
    td {
      padding: 12px 16px;
    }
  }
}
</style>
