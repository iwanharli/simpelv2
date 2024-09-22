<template>
  <b-row data-aos="fade-up" data-aos-delay="100">
    <b-col class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6 mb-2">
      <b-card class="bg-primary h-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-white">
            <h2 style="color: white">
              <!-- <vue3-autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_ship" /> -->
              {{ this.statisticData.total_ship }}
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
            <h2 style="color: white">
              <!-- <vue3-autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_checkin" /> -->
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
              <!-- <vue3-autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_checkout" /> -->
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
              <!-- <vue3-autocounter ref="counter" :startAmount="0" :endAmount="this.statisticData.total_fraud" /> -->
              {{ this.statisticData.total_fraud }}
            </h2>
            FRAUD
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import axios from "axios"
// import Vue3AutoCounter from 'vue3-autocounter';
import { defineComponent } from "vue"
// import Vue3autocounter from 'vue3-autocounter';

import { ref, onMounted } from "vue"
import { RouterLink } from "vue-router"

export default {
  name: "StatisticsComponent",
  components: {
    // 'vue3-autocounter': Vue3autocounter,
    RouterLink
  },
  setup() {
    const statisticData = ref([])

    const fetchStatisticChart = async () => {
      try {
        const token = localStorage.getItem("token")
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get("/api/v1/dashboard/statistic", config)

        statisticData.value = response.data.data
        console.log("💚 STATISTIC", statisticData.value)
      } catch (error) {
        console.error("💥 STATISTIC Error:", error)
      }
    }

    onMounted(fetchStatisticChart)

    return { statisticData }
  }
}
</script>
