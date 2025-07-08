<template>
  <div class="pie-chart">
    <div class="pie-header">
      <h3 class="pie-title">Tâches par statut</h3>
      
      <div class="period-selector">
        <select v-model="selectedPeriod" class="period-select">
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>
    </div>

    <div class="chart-container">
      <svg viewBox="0 0 200 200" class="pie-svg">

        <circle v-if="totalTasks > 0" v-for="(segment, index) in segments" :key="index" :cx="100" :cy="100" :r="80"
          :stroke="segment.color" :stroke-width="40"
          :stroke-dasharray="segment.circumference + ' ' + (totalCircumference - segment.circumference)"
          :stroke-dashoffset="segment.offset" transform="rotate(-90 100 100)" fill="transparent" class="pie-segment" />


        <circle v-if="totalTasks === 0" :cx="100" :cy="100" :r="80" :stroke-width="40" class="empty-pie" />

        <text x="100" y="105" text-anchor="middle" class="center-text">
          {{ totalTasks > 0 ? totalTasks + ' tâches' : 'Aucune tâche' }}
        </text>
      </svg>
    </div>

    <div class="legend">
      <div v-for="item in chartData" :key="item.label" class="legend-item">
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <span class="legend-label">{{ item.label }}</span>
        <span class="legend-value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const tasks = ref([])
const isLoading = ref(true)
let refreshInterval = null

// Période sélectionnée (par défaut: cette semaine)
const selectedPeriod = ref('week')

// Fonctions utilitaires pour les périodes
const isToday = (date) => {
  const today = new Date()
  const taskDate = new Date(date)
  return today.toDateString() === taskDate.toDateString()
}

const isThisWeek = (date) => {
  const today = new Date()
  const taskDate = new Date(date)
  
  // Début de la semaine (lundi)
  const weekStart = new Date(today)
  const day = weekStart.getDay()
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1)
  weekStart.setDate(diff)
  weekStart.setHours(0, 0, 0, 0)
  
  // Fin de la semaine (dimanche)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  
  return taskDate >= weekStart && taskDate <= weekEnd
}

const isThisMonth = (date) => {
  const today = new Date()
  const taskDate = new Date(date)
  return today.getMonth() === taskDate.getMonth() && today.getFullYear() === taskDate.getFullYear()
}

const isThisQuarter = (date) => {
  const today = new Date()
  const taskDate = new Date(date)
  
  if (today.getFullYear() !== taskDate.getFullYear()) return false
  
  const currentQuarter = Math.floor(today.getMonth() / 3)
  const taskQuarter = Math.floor(taskDate.getMonth() / 3)
  
  return currentQuarter === taskQuarter
}

const isThisYear = (date) => {
  const today = new Date()
  const taskDate = new Date(date)
  return today.getFullYear() === taskDate.getFullYear()
}

const isInSelectedPeriod = (date) => {
  switch (selectedPeriod.value) {
    case 'today':
      return isToday(date)
    case 'week':
      return isThisWeek(date)
    case 'month':
      return isThisMonth(date)
    case 'quarter':
      return isThisQuarter(date)
    case 'year':
      return isThisYear(date)
    default:
      return false
  }
}

const statusMapping = {
  'todo': 'À faire',
  'not_started': 'À faire',
  'in_progress': 'En cours',
  'blocked': 'Bloqué',
  'done': 'Terminé'
}

const colors = {
  'À faire': '#ff8c00',
  'En cours': '#0066cc',
  'Bloqué': '#cc0000',
  'Terminé': '#009900'
}

const chartData = computed(() => {
  const counts = {
    'À faire': 0,
    'En cours': 0,
    'Bloqué': 0,
    'Terminé': 0
  }

  tasks.value.forEach(task => {
    // Utiliser start_date si disponible, sinon created_at
    const taskDate = task.start_date || task.created_at
    
    if (taskDate && isInSelectedPeriod(taskDate)) {
      const category = statusMapping[task.status] || 'À faire'
      counts[category]++
    }
  })

  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    color: colors[label]
  }))
})

const totalTasks = computed(() => {
  return chartData.value.reduce((sum, item) => sum + item.value, 0)
})

const totalCircumference = 2 * Math.PI * 80

const segments = computed(() => {
  if (totalTasks.value === 0) return []

  let currentOffset = 0

  return chartData.value.map(item => {
    const percentage = item.value / totalTasks.value
    const circumference = percentage * totalCircumference

    const segment = {
      color: item.color,
      circumference,
      offset: -currentOffset
    }

    currentOffset += circumference
    return segment
  })
})

const fetchTasks = async () => {
  try {
    isLoading.value = true;
    tasks.value = await $fetch('/api/tasks/my-tasks');
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    tasks.value = [];
  } finally {
    isLoading.value = false;
  }
}

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

onMounted(() => {
  fetchTasks()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

defineExpose({
  refreshData: fetchTasks
})
</script>

<style lang="scss" scoped>
@use '../../assets/scss/base/variables' as *;
@use '../../assets/scss/utils/mixins' as *;

.pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.pie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.pie-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.period-selector {
  display: flex;
  align-items: center;
}

.period-select {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    border-color: #A0A9FF;
  }

  &:focus {
    border-color: #A0A9FF;
    box-shadow: 0 0 0 3px rgba(160, 169, 255, 0.1);
  }
}

.chart-container {
  width: 200px;
  height: 200px;
  position: relative;
}

.pie-svg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.center-text {
  font-size: 14px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}


.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}


.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 14px;
  font-weight: 500;
  color: $black;
  flex: 1;
}

.empty-pie {
  fill: transparent;
  stroke: #f2f2f2;
}

.legend-value {
  font-size: 14px;
  color: $black;
  margin-left: auto;
}

@media (max-width: 768px) {
  .pie-chart {
    gap: 1.5rem;
  }

  .pie-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .pie-title {
    font-size: 16px;
  }

  .period-selector {
    align-self: center;
  }

  .period-select {
    font-size: 13px;
    padding: 5px 10px;
  }

  .chart-container {
    width: 200px;
    height: 200px;
  }

  .legend {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
