<template>
  <!-- <MapDashboard3 /> -->

  <div style="padding: 0px !important">
    <div style="height: 100vh; width: 100%; background: #00000054; position: absolute; left: 0">
      <MapDashboard3 />
    </div>

    <div class="container-dashboard">
      <!-- <MapDashboard /> -->

      <div class="modal fade" id="modalStatistics" aria-labelledby="modalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h4 class="modal-title text-white" style="font-weight: bold">STATISTIK KAPAL</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="background: white; padding: 0px !important; border-radius: 15px">
              <b-card-body style="border-radius: 0px">
                <b-row>
                  <b-col xl="12" lg="12" md="12">
                    <StatisticChart />
                  </b-col>
                  <hr />
                  <b-col xl="6" lg="6" sm="12">
                    <TerrainChart />
                  </b-col>
                  <b-col xl="6" lg="6" sm="12">
                    <LogsChart />
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isDashboardChartVisible" class="bg-soft-light position-fixed top-0 start-50 translate-middle-x d-flex align-items-center scrollbar" style="z-index: 550; border-radius: 20px; margin-top: 160px"></div>

      <button @click="toggleDashboardChart" class="btn btn-primary position-absolute bottom-0 start-0 mb-3" data-bs-toggle="modal" data-bs-target="#modalStatistics" style="z-index: 500; border-radius: 30px; border: 5px solid white; padding: 20px; font-weight: bolder; margin-left: 20px">Lihat Statistik</button>
    </div>
  </div>
</template>

<script>
import AOS from "aos"
import { onMounted } from "vue"
import MapDashboard from "@/components/map/MapDashboard.vue"
import MapDashboard3 from "@/components/map/MapDashboard3.vue"
import StatisticChart from "@/components/chart/StatisticComponent.vue"
import TerrainChart from "@/components/chart/TerrainComponent.vue"
import LogsChart from "@/components/chart/LogsComponent.vue"

export default {
  data() {
    return {
      isDashboardChartVisible: false,

      center: { lat: -6.097643, lng: 106.802428 }
    }
  },

  setup() {
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
  },

  components: {
    MapDashboard3,
    StatisticChart,
    TerrainChart,
    LogsChart
  },

  methods: {
    toggleDashboardChart() {
      this.isDashboardChartVisible = !this.isDashboardChartVisible
    },
    closeDashboardChart() {
      this.isDashboardChartVisible = false
    }
  }
}
</script>

<style></style>
