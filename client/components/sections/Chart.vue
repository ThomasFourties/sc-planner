<template>
  <div class="chart">
    <h3 class="chart-title">Tâches par jour</h3>

    <div class="chart-container">
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const tasks = ref([])
const isLoading = ref(true)
let refreshInterval = null

const daysOfWeek = [
  { name: 'Lundi', index: 1 },
  { name: 'Mardi', index: 2 },
  { name: 'Mercredi', index: 3 },
  { name: 'Jeudi', index: 4 },
  { name: 'Vendredi', index: 5 }
]

const tasksByDay = computed(() => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  tasks.value.forEach(task => {
    if (task.start_date) {
      const startDate = new Date(task.start_date)
      const dayOfWeek = startDate.getDay()

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        counts[dayOfWeek]++
      }
    }
  })

  return counts
})

const maxValue = computed(() => {
  const values = Object.values(tasksByDay.value)
  const max = Math.max(...values, 1)
  return Math.ceil(max / 2) * 2 // Arrondir au pair supérieur
})

const yAxisTicks = computed(() => {
  const ticks = []
  for (let i = 0; i <= maxValue.value; i += 2) {
    ticks.push(i)
  }
  return ticks.reverse()
})

const chartData = computed(() => {
  return daysOfWeek.map(day => {
    const count = tasksByDay.value[day.index]
    const height = maxValue.value > 0 ? (count / maxValue.value) * 100 : 0
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

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
}

.chart-container {
  display: flex;
  align-items: stretch;
  height: 300px;
  gap: 16px;
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
  background: #A0A9FF;
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
  margin-top: 8px;
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

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -705px;
    width: 700px;
    height: 1px;
    background-color: #E0E0E0;
    z-index: 0;
  }
}

@media (max-width: 768px) {
  .chart {
    padding: 16px;
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