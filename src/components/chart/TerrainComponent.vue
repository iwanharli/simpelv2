<template>
  <div class="p-2" style="border-radius: 10px; max-height: 500; background: #146ec833">
    <apexchart type="pie" :options="chartCategory.chartOptions" :series="chartCategory.series" :height="305" style="width: 500"></apexchart>
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import axios from "axios"
import AOS from "aos"

export default {
  name: "TerrainChart",

  setup() {
    const terrainData = ref([])
    const chartCategory = ref({
      series: [],
      chartOptions: {
        chart: { type: "pie" },
        legend: { position: "bottom" },
        labels: ["Darat", "Air"],
        tooltip: { x: { show: true } },
        colors: ["#632e24", "#3399FF"]
      }
    })

    onMounted(() => {
      AOS.init({
        disable: () => window.innerWidth < 996,
        once: true,
        duration: 800
      })
      fetchTerrainChart()
    })

    // Fetch data for chart
    const fetchTerrainChart = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get("/api/v1/dashboard/terrain-chart", config)
        terrainData.value = response.data.data

        const dataArray = Object.values(terrainData.value)
        console.log("💚 TERRAIN CHART", dataArray)

        chartCategory.value = {
          series: dataArray,
          chartOptions: {
            labels: ["Darat", "Air"]
          }
        }
      } catch (error) {
        console.error("💥 TERRAIN CHART Error:", error)
      }
    }

    return { chartCategory }
  }
}
</script>
