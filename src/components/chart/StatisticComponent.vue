<template>
  <b-row data-aos="fade-up" data-aos-delay="100">
    <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
      <b-card class="bg-primary h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-white">
            <h2 style="color: white">
              <Vue3autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_ship" />
            </h2>
            TOTAL KAPAL
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
      <b-card class="bg-info h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-white">
            <h2 style="color: white"><Vue3autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_checkin" /></h2>
            CHECK IN
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
      <b-card class="bg-warning h-100 card-custom">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-white">
            <h2 style="color: white"><Vue3autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_checkout" /></h2>
            CHECK OUT
          </div>
        </div>
      </b-card>
    </b-col>

    <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
      <b-card class="h-100 card-custom" style="background: #c74f7c">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-white">
            <h2 style="color: white"><Vue3autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_fraud" /></h2>
            FRAUD
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import axios from "axios"
import Vue3autocounter from "vue3-autocounter"

import { ref, onMounted } from "vue"
import { RouterLink } from "vue-router"

export default {
  name: "Ship Page",
  components: {
    Vue3autocounter,
    RouterLink
  },

  data() {
    return {
      statisticData: []
    }
  },

  mounted() {
    this.fetchStatisticChart()
  },

  methods: {
    async fetchStatisticChart() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      await axios
        .get("/api/v1/dashboard/statistic", config)
        .then((response) => {
          this.statisticData = response.data.data

          console.log("💚 STATISTIC", this.statisticData)
        })
        .catch((error) => {
          console.error("💥 STATISTIC Error:", error)
        })
    }
  }
}
</script>
