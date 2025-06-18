<template>
  <div class="pie-chart">
    <h3 class="pie-title">Tâches par statut</h3>

    <div class="chart-container">
      <svg viewBox="0 0 200 200" class="pie-svg">
        <circle v-for="(segment, index) in segments" :key="index" :cx="100" :cy="100" :r="80" :stroke="segment.color"
          :stroke-width="40"
          :stroke-dasharray="`${segment.circumference} ${totalCircumference - segment.circumference}`"
          :stroke-dashoffset="segment.offset" :transform="`rotate(-90 100 100)`" fill="transparent"
          class="pie-segment" />
        <text x="100" y="105" text-anchor="middle" class="center-text">
          {{ totalTasks }} tâches
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
import { useTasks } from '~/composables/useTasks'
import { useAuthStore } from '~/stores/auth'

const { getAllTasks } = useTasks()
const authStore = useAuthStore()

const tasks = ref([])
const isLoading = ref(true)
let refreshInterval = null

const statusMapping = {
  'todo': 'À faire',
  'not_started': 'À faire',
  'in_progress': 'En cours',
  'blocked': 'Bloqué',
  'done': 'Terminé'
}

const colors = {
  'À faire': '#ff8c00',   // orange
  'En cours': '#0066cc',  // bleu
  'Bloqué': '#cc0000',    // rouge
  'Terminé': '#009900'    // vert
}

const chartData = computed(() => {
  const counts = {
    'À faire': 0,
    'En cours': 0,
    'Bloqué': 0,
    'Terminé': 0
  }

  tasks.value.forEach(task => {
    const category = statusMapping[task.status] || 'À faire'
    counts[category]++
  })

  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
    color: colors[label]
  })).filter(item => item.value > 0)
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


.pie-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  align-self: flex-start;
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

.legend-value {
  font-size: 14px;
  color: $black;
  margin-left: auto;
}

@media (max-width: 768px) {
  .pie-chart {
    gap: 1.5rem;
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