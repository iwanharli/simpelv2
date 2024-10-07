<template>
  <b-row class="p-4">
    <b-col xl="12" class="bg-transparent" data-aos="fade" data-aos-delay="100">
      <div class="card bg-light" style="border-radius: 0px 0px 20px 20px">
        <b-card-header class="bg-primary text-light pb-4">
          <div class="header-title">
            <b-row class="row d-flex justify-content-between">
              <b-col xl="9" lg="9" md="9" sm="9">
                <h4 style="font-weight: bold; color: white">LIST GEOFENCE</h4>
              </b-col>
              <b-col xl="3" lg="3" md="3" sm="3" class="d-flex justify-content-end">
                <button type="button" class="btn btn-sm btn-danger" style="display: inline-block; margin-left: 10px; border: 1px solid white" @click="goToAddGeofence"><i class="ti ti-plus me-sm-1"></i> GEOFENCE</button>
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body bg-soft-primary" style="border-radius: 0px 0px 20px 20px; border: 5px solid #3a57e8; padding: 30px; padding-bottom: 0px; height: 82vh; overflow: auto">
          <div class="row">
            <b-col class="col-lg-4 col-md-12" v-for="zone in appSetting.zone" :key="zone.id">
              <b-card class="hover-card" @click="geofenceDetail(zone.id, zone.color.fill)" data-aos="fade-left" data-aos-delay="200">
                <div class="row" style="height: 100%">
                  <div class="col-12">
                    <div class="row p-2 pb-2">
                      <div class="col-4 p-2 mb-4 d-flex justify-content-center align-items-center" style="background: #18acd8; border-radius: 15px 0px 0px 15px; border: 5px solid white; border-right: none">
                        <div style="color: white; font-weight: bold; font-size: 20px; text-transform: uppercase">
                          {{ zone.name === "harbour" ? "labuh" : zone.name }}
                        </div>
                      </div>
                      <div class="col-4 p-2 mb-2 text-end" style="background: #432020; border-radius: 0px 0px 0px 10px; border: 5px solid white; border-right: none">
                        <h6 style="font-weight: bold; font-size: 14px; color: white">
                          COST <br /><br />
                          {{ formatCurrency(zone.docking_cost) }}
                        </h6>
                      </div>
                      <div class="col-4 p-2 mb-2 text-end" style="background: #ac4343; border-radius: 0px 10px 10px 0px; border: 5px solid white">
                        <h6 style="font-weight: bold; font-size: 14px; color: white">
                          MULTIPLIER <br /><br />
                          {{ formatTime(zone.cost_multiplier) }}
                        </h6>
                      </div>
                      <!-- {{ zone.color }} -->
                    </div>
                  </div>
                  <div class="col-12" style="width: 100%; height: 300px; border-radius: 10px">
                    <div :id="'map-' + zone.id" style="width: 100%; height: 100%; border-radius: 10px 10px 10px 10px; border: 5px solid #7ca7cc36" data-aos="fade" data-aos-delay="500"></div>
                  </div>
                </div>
              </b-card>
            </b-col>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"

import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { onMounted, ref } from "vue"

export default {
  name: "SettingPage",
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

  data() {
    return {
      appSetting: {}
    }
  },

  mounted() {
    this.getSettingApp()
  },

  methods: {
    async getSettingApp() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("api/v1/setting/web", config)
        .then((res) => {
          this.appSetting = res.data.data

          this.$nextTick(() => {
            this.initMaps()
          })

          console.log("💚 SETTING FETCHED", this.appSetting)
        })
        .catch((error) => {
          console.log("💥 GET SETTING FAILED")

          setTimeout(this.getSettingApp, 1000)
        })
    },

    initMaps() {
      const colors = [
        { border: "yellow", fill: "yellow" },
        { border: "blue", fill: "#3951ce8f" },
        { border: "green", fill: "lightgreen" },
        { border: "red", fill: "pink" },
        { border: "purple", fill: "violet" },
        { border: "orange", fill: "lightorange" }
      ]

      this.appSetting.zone.forEach((zone, index) => {
        const latLngs = zone.geofences.map((fence) => [fence.lat, fence.long])
        const center = [-6.097643, 106.802428]

        const map = L.map(`map-${zone.id}`, {
          zoomControl: false,
          attributionControl: false
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19
        }).addTo(map)

        // Select color for the current zone based on the index (wrap around if needed)
        const color = colors[index % colors.length]
        zone.color = color

        L.polygon(latLngs, {
          color: color.border,
          fillColor: color.fill,
          fillOpacity: 0.5
        }).addTo(map)

        // Use fitBounds to adjust the map view to the bounds of the polygon
        const bounds = L.latLngBounds(latLngs) // Create bounds from the polygon's latLngs
        map.fitBounds(bounds) // Fit the map to the bounds of the polygon
      })
    },

    geofenceDetail(geofenceId) {
      this.$router.push({
        name: "admin.setting-geofenceDetail",
        params: { geofenceId }
      })
    },

    goToAddGeofence() {
      this.$router.push({ name: "admin" + ".add-geofence" })
    },

    // STYLING
    formatCurrency(value) {
      return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatTime(costMultiplier) {
      const totalMinutes = costMultiplier
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return `${hours} jam ${minutes} menit`
    }
  }
}
</script>

<style>
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  /* box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5); */
}

.hover-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 8px 20px rgba(83, 83, 83, 0.5);
  background: rgb(35 102 202 / 40%);
  color: white;
}
</style>
