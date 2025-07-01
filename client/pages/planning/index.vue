<!-- <template>
  <div class="planning">
    <div class="planning-header">
      <h1 class="planning-title">Planning</h1>
      <div class="week-navigation">
        <button @click="previousWeek" class="nav-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="week-date">{{ formatWeekRange() }}</span>
        <button @click="nextWeek" class="nav-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="planning-content">
      <div class="planning-grid">
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="day-row"
          :class="{ 'today': isToday(day.date) }"
        >
          <div class="day-label">
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ formatDayDate(day.date) }}</div>
          </div>
          
          <div class="tasks-container">
            <div 
              v-for="task in getTasksForDay(day.date)" 
              :key="task.id"
              class="task-card"
              :style="{ backgroundColor: getTaskColor(task.status) }"
              @click="openTaskDetail(task)"
            >
              <div class="task-name">{{ task.name }}</div>
              <div class="task-info">
                <span class="task-assignee">
                  {{ task.assigned_to ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : 'Non assigné' }}
                </span>
                <span class="task-duration">{{ formatDuration(task.duration) }}</span>
              </div>
            </div>
            
            <div v-if="getTasksForDay(day.date).length === 0" class="no-tasks">
              Aucune tâche planifiée
            </div>
          </div>
        </div>
      </div>
    </div>

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
const currentWeekStart = ref(new Date())
const showTaskDetail = ref(false)
const selectedTask = ref(null)
let refreshInterval = null

// Couleurs par statut
const statusColors = {
  'todo': '#fbbf24',      // orange/jaune
  'not_started': '#fbbf24',
  'in_progress': '#3b82f6', // bleu
  'blocked': '#ef4444',     // rouge
  'done': '#10b981'         // vert
}

// Calcul des jours de la semaine
const weekDays = computed(() => {
  const startOfWeek = new Date(currentWeekStart.value)
  // Ajuster pour commencer le lundi
  const dayOfWeek = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  const days = []
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    days.push({
      name: dayNames[i],
      date: new Date(date)
    })
  }
  
  return days
})

// Fonctions utilitaires
const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const formatWeekRange = () => {
  const start = weekDays.value[0]?.date
  const end = weekDays.value[6]?.date
  
  if (!start || !end) return ''
  
  const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  
  return `${startStr} - ${endStr}`
}

const formatDayDate = (date) => {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
}

const formatDuration = (duration) => {
  if (!duration) return ''
  return `${duration}h`
}

const getTaskColor = (status) => {
  return statusColors[status] || statusColors.todo
}

const getTasksForDay = (date) => {
  return tasks.value.filter(task => {
    if (!task.start_date) return false
    const taskDate = new Date(task.start_date)
    return taskDate.toDateString() === date.toDateString()
  })
}

// Navigation semaine
const previousWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
}

const nextWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
}

// Gestion des tâches
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

// Modal de détail
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
    console.log('Sauvegarde de la tâche:', updatedTask)
    
    const taskIndex = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updatedTask }
    }
    
    closeTaskDetail()
    await fetchTasks()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

// Initialiser la semaine courante
const initCurrentWeek = () => {
  const today = new Date()
  currentWeekStart.value = today
}

// Lifecycle
onMounted(() => {
  const planningLink = document.querySelector('.planning.nav-link')
  if (planningLink) {
    planningLink.classList.add('active')
  }
  
  initCurrentWeek()
  fetchTasks()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/sections' as *;

.planning {
  padding: 24px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.planning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.planning-title {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
}

.week-date {
  font-weight: 500;
  color: #374151;
  min-width: 200px;
  text-align: center;
}

.planning-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.planning-grid {
  display: flex;
  flex-direction: column;
}

.day-row {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  min-height: 80px;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.today {
    background-color: #fef3c7;
    border-left: 4px solid #f59e0b;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
}

.day-label {
  width: 120px;
  padding: 20px 24px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f8fafc;
}

.day-name {
  font-weight: 600;
  color: #374151;
  font-size: 16px;
  margin-bottom: 4px;
}

.day-date {
  font-size: 14px;
  color: #6b7280;
}

.tasks-container {
  flex: 1;
  padding: 16px 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
  }
}

.task-card {
  min-width: 200px;
  max-width: 280px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.task-name {
  font-weight: 600;
  color: white;
  font-size: 14px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.task-assignee {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.task-duration {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  margin-left: 8px;
}

.no-tasks {
  color: #9ca3af;
  font-style: italic;
  font-size: 14px;
}

@media (max-width: 768px) {
  .planning {
    padding: 16px;
  }
  
  .planning-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .week-navigation {
    justify-content: center;
  }
  
  .day-row {
    flex-direction: column;
    min-height: auto;
  }
  
  .day-label {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .tasks-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .task-card {
    min-width: auto;
    max-width: none;
  }
}
</style>  -->

<template>
  <div>
    <h1 >Planning</h1>
  </div>
</template>