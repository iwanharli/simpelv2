<template>
  <div class="bg-soft-light p-2" style="border-radius: 10px; max-height: 500">
    <apexchart type="pie" :options="chartCategory.chartOptions" :series="chartCategory.series" :height="305" style="width: 500"></apexchart>
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import axios from "axios"
import AOS from "aos"

export default {
  data() {
    return {
      terrainData: [],
      terrainChart: []
    }
  },

  setup() {
    const chartCategory = ref({
      series: [],
      chartOptions: {
        chart: {
          type: "pie"
        },
        legend: {
          position: "bottom"
        },
        labels: ["Darat", "Air"],
        tooltip: {
          x: {
            show: true
          }
        },
        colors: ["#632e24", "#3399FF"]
      }
    })

    onMounted(() => {
      AOS.init({
        disable: function () {
          var maxWidth = 996
          return window.innerWidth < maxWidth
        },
        once: true,
        duration: 800
      })
    })
    return { chartCategory }
  },

  mounted() {
    this.fetchTerrainChart()
  },

  methods: {
    async fetchTerrainChart() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      await axios
        .get("/api/v1/dashboard/terrain-chart", config)
        .then((response) => {
          this.terrainData = response.data.data

          const dataArray = Object.values(this.terrainData)
          console.log("💚 TERRAIN CHART", dataArray)

          this.chartCategory = {
            series: dataArray,
            chartOptions: {
              labels: ["Darat", "Air"]
            }
          }
        })
        .catch((error) => {
          console.error("💥 TERRAIN CHART Error:", error)
        })
    }
  }
}
</script>
