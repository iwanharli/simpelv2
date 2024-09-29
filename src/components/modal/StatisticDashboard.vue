<template>
  <div v-if="isDashboardChartVisible" class="bg-soft-light position-fixed top-0 start-50 translate-middle-x d-flex align-items-center scrollbar" style="z-index: 550; border-radius: 20px; margin-top: 160px"></div>
  <button @click="toggleDashboardChart" class="btn btn-primary btn-statistic position-absolute bottom-0 start-0 mb-3" data-bs-toggle="modal" data-bs-target="#modalStatistics">Lihat Statistik</button>

  <div class="modal fade" id="modalStatistics" aria-labelledby="modalToggleLabel" tabindex="-1" style="display: none">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content" style="background: #ffffff42; border: 4px solid white; border-radius: 30px">
        <div class="modal-header bg-primary d-none">
          <h4 class="modal-title text-white" style="font-weight: bold">STATISTIK KAPAL</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="background: transparent; padding: 0px !important; border-radius: 15px">
          <b-card-body style="border-radius: 0px">
            <b-row>
              <!-- STATISTIK -->
              <b-col xl="12" lg="12" md="12">
                <b-row data-aos="fade-up" data-aos-delay="100">
                  <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
                    <b-card class="bg-primary h-100 card-custom">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-white">
                          <h2 style="color: white">
                            {{ this.statisticData.total_ship }}
                          </h2>
                          TOTAL KAPAL
                        </div>
                      </div>
                    </b-card>
                  </b-col>

                  <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
                    <b-card class="bg-info h-100 card-custom">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-white">
                          <h2 style="color: white">
                            {{ this.statisticData.total_checkin }}
                          </h2>
                          CHECK IN
                        </div>
                      </div>
                    </b-card>
                  </b-col>

                  <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
                    <b-card class="bg-warning h-100 card-custom">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-white">
                          <h2 style="color: white">
                            {{ this.statisticData.total_checkout }}
                          </h2>
                          CHECK OUT
                        </div>
                      </div>
                    </b-card>
                  </b-col>

                  <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
                    <b-card class="h-100 card-custom" style="background: #c74f7c">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-white">
                          <h2 style="color: white">
                            {{ this.statisticData.total_fraud }}
                          </h2>
                          FRAUD
                        </div>
                      </div>
                    </b-card>
                  </b-col>
                </b-row>
              </b-col>
              <hr />

              <!-- PIE CHART  -->
              <b-col xl="6" lg="6" sm="12">
                <div class="p-2" style="background: #00000054; border-radius: 20px; height: 325px; border: 2px solid white; width: 100%">
                  <apexchart type="pie" :options="chartCategory.chartOptions" :series="chartCategory.series" :height="505"></apexchart>
                </div>
              </b-col>

              <!-- BAR CHART  -->
              <b-col xl="6" lg="6" sm="12">
                <div class="p-2" style="background: #00000054; border-radius: 20px; height: 325px; border: 2px solid white; width: 100%">
                  <apexchart type="bar" :options="chartLogs.options" :series="chartLogs.series" :height="305"></apexchart>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { ref } from "vue"

export default {
  setup() {
    // Use ref for reactive variables
    const isDashboardChartVisible = ref(false)

    const statisticData = ref([])
    const chartCategory = ref({
      series: [],
      chartOptions: {
        chart: { type: "pie" },
        legend: { position: "bottom", show: false },
        labels: ["Darat", "Air"], // Ensure these labels are populated
        tooltip: { x: { show: true } },
        colors: ["#8B4513", "#00BFFF"],
        dataLabels: {
          style: {
            colors: ["#FFFFFF"] // Set label colors to white
          }
        }
      }
    })

    const chartLogs = ref({
      series: [{ data: [] }],
      options: {
        chart: { type: "bar", stacked: false, toolbar: { show: true } },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            columnWidth: "28%",
            endingShape: "rounded",
            borderRadius: 5,
            dataLabels: { position: "bottom" }
          }
        },
        legend: { show: false },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: { colors: ["#fff"] },
          formatter: (val, opt) => {
            // Safeguard against undefined values
            const label = opt?.w?.globals?.labels?.[opt.dataPointIndex] ?? "Unknown"
            return `${label}: ${val?.toString() ?? 0}`
          },
          offsetX: 0,
          dropShadow: { enabled: true }
        },
        stroke: { width: 1, colors: ["#fff"] },
        xaxis: { categories: [] }, // Ensure categories are populated
        yaxis: { labels: { show: false } },
        title: { text: "", align: "center", floating: true },
        fill: { opacity: 1 },
        tooltip: {
          x: { show: false },
          y: { formatter: (val) => `${val?.toString() ?? 0} Histori` }
        }
      }
    })

    const fetchAllCharts = async () => {
      try {
        const config = createConfig() // Create axios config

        // Make the API call to the new URL
        const response = await axios.get("/api/v1/dashboard/terrain-logs-statistic", config)

        if (response.data?.data) {
          const { statistic, terrain, logs_chart } = response.data.data

          // Handle responses for statistic data
          if (statistic) {
            statisticData.value = statistic
            console.log("💚 STATISTIC", statisticData.value)
          } else {
            console.error("💥 STATISTIC Error: No valid data found in response")
          }

          // Handle responses for terrain data
          if (terrain) {
            const dataArray = Object.values(terrain || {})
            console.log("💚 TERRAIN CHART", dataArray)

            // Ensure the array contains valid numbers before updating chart data
            if (dataArray.every((item) => typeof item === "number")) {
              chartCategory.value = {
                series: dataArray,
                chartOptions: {
                  labels: ["Darat", "Air"]
                }
              }
            } else {
              console.error("💥 TERRAIN CHART Error: Invalid data format for the chart series")
            }
          } else {
            console.error("💥 TERRAIN CHART Error: No valid data found in response")
          }

          // Handle responses for logs data
          if (logs_chart) {
            console.log("💚 LOGS CHART", logs_chart)

            const keyOrder = ["checkin", "checkout", "fraud", "out_of_scope"]
            const dataArray = keyOrder.map((key) => logs_chart[key] ?? 0)

            // Update chartLogs with fetched data and keep existing options
            chartLogs.value = {
              series: [{ data: dataArray }],
              options: {
                ...chartLogs.value.options, // Preserve existing chart options
                xaxis: { categories: ["CHECKIN", "CHECKOUT", "FRAUD", "OUT OF SCOPE"] }
              }
            }
          } else {
            console.error("💥 LOGS CHART Error: No valid data found in response")
          }
        } else {
          console.error("💥 Error: No valid data found in response")
        }
      } catch (error) {
        console.error("💥 Error fetching all charts:", error)
      }
    }

    const createConfig = () => {
      const token = localStorage.getItem("token")
      return { headers: { Authorization: `Bearer ${token}` } }
    }

    // Methods to toggle visibility of dashboard charts
    const toggleDashboardChart = async () => {
      try {
        await fetchAllCharts()
        isDashboardChartVisible.value = !isDashboardChartVisible.value
      } catch (error) {
        console.error("Error toggling dashboard chart:", error)
      }
    }

    const closeDashboardChart = () => {
      isDashboardChartVisible.value = false
    }

    return {
      isDashboardChartVisible,
      statisticData,
      chartCategory,
      chartLogs,
      toggleDashboardChart,
      closeDashboardChart
    }
  }
}
</script>

<style>
.btn-statistic {
  z-index: 500;
  border-radius: 30px;
  border: 3px solid white !important;
  padding: 20px;
  font-weight: bolder;
  margin-left: 20px;
  animation: blink-shadow 1s infinite;
}

@keyframes blink-shadow {
  0% {
    box-shadow: 0 0 0px rgba(255, 165, 0, 1), 0 0 0px rgba(255, 165, 0, 0.8);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 165, 0, 1), 0 0 20px rgba(255, 165, 0, 1);
  }
  100% {
    box-shadow: 0 0 0px rgba(255, 165, 0, 1), 0 0 0px rgba(255, 165, 0, 0.8);
  }
}




.card-custom {
  border: 3px solid white;
  border-radius: 10px 10px 20px 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Add box shadow */
  transition: transform 0.2s; /* Smooth scaling on hover */
}

.card-custom:hover {
  transform: scale(1.05); /* Slightly enlarge on hover */
}
</style>
