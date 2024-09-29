<template>
  <div style="padding: 0px !important">
    <b-card no-body style="margin-bottom: 0px">
      <div class="position-relative">
        <MapDashboard />

        <ModalStatistic />
      </div>
    </b-card>
  </div>
</template>

<script>
import AOS from "aos"
import { onMounted } from "vue"
import MapDashboard from "@/components/map/MapDashboard.vue"
import ModalStatistic from "@/components/modal/StatisticDashboard.vue"

export default {
  data() {
    return {
      isDashboardChartVisible: false
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
    MapDashboard,
    ModalStatistic
  }
}
</script>
