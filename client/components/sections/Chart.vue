<template>
  <div class="chart">
    <div class="chart-header">
      <h3 class="chart-title">Tâches de la semaine</h3>

      <div class="week-navigation">
        <button @click="previousWeek" class="nav-button">
          <ChevronLeft />
        </button>
        
        <div class="week-display">
          <span class="week-text">{{ weekDisplayText }}</span>
          <span v-if="isCurrentWeek" class="current-week-indicator">Actuelle</span>
        </div>
        
        <button @click="nextWeek" class="nav-button">
          <ChevronRight />
        </button>
      </div>
    </div>

    <div class="chart-container">
      <div class="chart-grid">
        <div v-for="tick in yAxisTicks" :key="tick" class="grid-line"></div>
      </div>

      <div class="chart-bars">
        <div v-for="day in chartData" :key="day.name" class="bar-container">
          <div class="bar-wrapper">
            <div class="bar" :class="{ 'day-off': day.isOff }" :style="{ height: `${day.height}%` }">
              <span v-if="day.isOff" class="bar-text">OFF</span>
            </div>
          </div>
          <span class="day-label">{{ day.name }}</span>
        </div>
      </div>

      <div class="y-axis">
        <div v-for="tick in yAxisTicks" :key="tick" class="y-tick">
          {{ tick }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const tasks = ref([])
const isLoading = ref(true)
let refreshInterval = null

// État pour la semaine sélectionnée
const selectedWeek = ref(new Date())

const daysOfWeek = [
  { name: 'Lundi', index: 1 },
  { name: 'Mardi', index: 2 },
  { name: 'Mercredi', index: 3 },
  { name: 'Jeudi', index: 4 },
  { name: 'Vendredi', index: 5 }
]

// Fonctions utilitaires pour les dates
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Ajuster pour que lundi soit le début
  const weekStart = new Date(d)
  weekStart.setDate(diff)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

const getWeekEnd = (date) => {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd
}

const isInCurrentWeek = (taskDate) => {
  const weekStart = getWeekStart(selectedWeek.value)
  const weekEnd = getWeekEnd(selectedWeek.value)

  const task = new Date(taskDate)
  task.setHours(0, 0, 0, 0)

  return task >= weekStart && task <= weekEnd
}

// Fonctions de navigation
const previousWeek = () => {
  const newWeek = new Date(selectedWeek.value)
  newWeek.setDate(newWeek.getDate() - 7)
  selectedWeek.value = newWeek
}

const nextWeek = () => {
  const newWeek = new Date(selectedWeek.value)
  newWeek.setDate(newWeek.getDate() + 7)
  selectedWeek.value = newWeek
}

const goToCurrentWeek = () => {
  selectedWeek.value = new Date()
}

// Texte d'affichage de la semaine
const weekDisplayText = computed(() => {
  const weekStart = getWeekStart(selectedWeek.value)
  const weekEnd = getWeekEnd(selectedWeek.value)

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    })
  }

  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
})

// Vérifier si on est sur la semaine actuelle
const isCurrentWeek = computed(() => {
  const today = new Date()
  const currentWeekStart = getWeekStart(today)
  const selectedWeekStart = getWeekStart(selectedWeek.value)

  // Comparer les dates normalisées (début de semaine)
  const currentWeekStartTime = currentWeekStart.getTime()
  const selectedWeekStartTime = selectedWeekStart.getTime()

  return currentWeekStartTime === selectedWeekStartTime
})

const tasksByDay = computed(() => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  // Filtrer uniquement les tâches "À faire" et "En cours"
  const validStatuses = ['todo', 'not_started', 'in_progress']

  tasks.value.forEach(task => {
    if (task.start_date && validStatuses.includes(task.status)) {
      // Vérifier si la tâche est dans la semaine sélectionnée
      if (isInCurrentWeek(task.start_date)) {
        const startDate = new Date(task.start_date)
        const dayOfWeek = startDate.getDay()

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          counts[dayOfWeek]++
        }
      }
    }
  })

  return counts
})

const maxValue = computed(() => {
  const values = Object.values(tasksByDay.value)
  return Math.max(...values, 0)
})

const yAxisTicks = computed(() => {
  if (maxValue.value === 0) {
    return [] // Pas de ticks si pas de tâches
  }

  const max = maxValue.value
  let step = 1
  let tickMax = max

  // Logique adaptative pour le pas et la valeur max
  if (max <= 5) {
    step = 1
    tickMax = max
  } else if (max <= 10) {
    step = 2
    tickMax = Math.ceil(max / 2) * 2
  } else if (max <= 20) {
    step = 5
    tickMax = Math.ceil(max / 5) * 5
  } else {
    step = 10
    tickMax = Math.ceil(max / 10) * 10
  }

  const ticks = []
  for (let i = 0; i <= tickMax; i += step) {
    ticks.push(i)
  }
  return ticks.reverse()
})

const chartMaxValue = computed(() => {
  if (maxValue.value === 0) return 0

  const max = maxValue.value
  if (max <= 5) return max
  if (max <= 10) return Math.ceil(max / 2) * 2
  if (max <= 20) return Math.ceil(max / 5) * 5
  return Math.ceil(max / 10) * 10
})

const chartData = computed(() => {
  return daysOfWeek.map(day => {
    const count = tasksByDay.value[day.index]
    const height = chartMaxValue.value > 0 ? (count / chartMaxValue.value) * 100 : 0
    const isOff = count === 0 && day.index === 5

    return {
      name: day.name,
      count,
      height: height || (isOff ? 100 : 0),
      isOff
    }
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

.chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: 0;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;

  &:hover {
    border-color: #A0A9FF;
    color: #A0A9FF;
    background: #f8faff;
  }

  &:active {
    transform: scale(0.95);
  }
}

.week-display {
  min-width: 120px;
  text-align: center;
}

.week-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.current-week-indicator {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: $blue;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-container {
  display: flex;
  align-items: stretch;
  height: 300px;
  gap: 16px;
  position: relative;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 24px;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 0;
}

.grid-line {
  width: 100%;
  height: 1px;
  background-color: #E0E0E0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: 1;
  height: 100%;
  padding-bottom: 10px;
  position: relative;
  z-index: 1;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.bar-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: 60px;
}

.bar {
  width: 100%;
  background: $blue;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-off {
  background: #f2f2f2;
  border-radius: 0;
  border-bottom: 1px solid #E0E0E0;


  .bar-text {
    font-size: 20px;
    color: $black;
    font-weight: 400;
  }
}

.bar-text {
  font-size: 11px;
  font-weight: bold;
  color: $black;
  transform: rotate(-90deg);
  white-space: nowrap;
}

.day-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  text-align: center;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: calc(100% - 30px);
  padding-left: 8px;
}

.y-tick {
  position: relative;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1;
}

@media (max-width: 768px) {
  .chart {
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .chart-title {
    font-size: 16px;
  }

  .week-navigation {
    align-self: center;
  }

  .week-display {
    min-width: 100px;
  }

  .week-text {
    font-size: 13px;
  }

  .nav-button {
    width: 28px;
    height: 28px;
  }

  .chart-container {
    height: 250px;
  }

  .chart-bars {
    gap: 8px;
  }

  .bar-wrapper {
    max-width: 30px;
  }

  .day-label {
    font-size: 12px;
  }
}
</style>