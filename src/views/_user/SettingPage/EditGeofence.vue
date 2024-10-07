<template>
  <b-row class="p-0">
    <b-col xl="12" class="bg-transparent" data-aos="fade" data-aos-delay="100">
      <div class="card" style="margin-bottom: 0px !important; height: 93.4vh">
        <b-card-header class="bg-primary text-light pb-4" style="border-radius: 0px">
          <div class="header-title">
            <b-row class="row d-flex justify-content-between">
              <b-col xl="8" lg="8" md="8" sm="8">
                <h4 style="font-weight: bold; color: white">EDIT ZONA</h4>
              </b-col>
              <b-col xl="4" lg="4" md="4" sm="4" class="d-flex justify-content-end">
                <!-- <button type="button" class="btn btn-sm btn-warning" style="display: inline-block; margin-left: 10px; border: 1px solid white; font-size: 17px" @click="saveGeofence">SIMPAN GEOFENCE</button> -->
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body bg-white" style="padding: 0px; position: relative" v-if="geofenceDetail" data-aos="fade-right" data-aos-delay="500">
          <div id="detail-geofence-map" style="height: 100%; width: 100%" data-aos="fade" data-aos-delay="100"></div>

          <div style="background: #ffffffb0; height: auto; position: absolute; bottom: 0; right: 0; width: 300px; border-top: 5px solid white; border-left: 5px solid white; z-index: 10000">
            <div class="row d-flex align-items-center p-3">
              <!-- NAMA Section -->
              <div class="col-12 mb-3">
                <label for="dockingName" class="form-label" style="font-weight: bold">NAMA</label>
                <input type="text" id="dockingName" class="form-control" v-model="this.geofenceDetail.name" placeholder="Nama Zona" style="border: 2px solid #b2b2ff; width: 100%" />
              </div>

              <!-- BIAYA Section -->
              <div class="col-12 mb-3">
                <label for="dockingCost" class="form-label" style="font-weight: bold">BIAYA</label>
                <input type="text" id="dockingCost" class="form-control" v-model="formattedDockingCost" placeholder="Biaya" style="border: 2px solid #b2b2ff; width: 100%" @input="updateDockingCost" />
              </div>

              <!-- SETIAP Section -->
              <div class="col-12 mb-3">
                <label for="costMultiplierHours" class="form-label" style="font-weight: bold">SETIAP</label>
                <div class="d-flex">
                  <select id="costMultiplierHours" class="form-control me-2" v-model="selectedHours" style="border: 2px solid #b2b2ff; width: 50%">
                    <option :value="selectedHours" disabled style="display: none">
                      {{ selectedHours ? `${selectedHours} jam` : "Pilih Jam" }}
                    </option>
                    <option v-for="option in hourOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>

                  <select id="costMultiplierMinutes" class="form-control" v-model="selectedMinutes" style="border: 2px solid #b2b2ff; width: 50%">
                    <option :value="selectedMinutes" disabled style="display: none">
                      {{ selectedMinutes ? `${selectedMinutes} menit` : "Pilih Menit" }}
                    </option>
                    <option v-for="option in minuteOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Save Button Section -->
              <div class="col-12 mt-2 text-end">
                <button type="button" class="btn btn-sm btn-info" style="border: 1px solid white; font-size: 17px; width: 100%; height: 45px" @click="saveGeofence">SIMPAN</button>
              </div>
            </div>
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
import { onMounted, ref } from "vue"

import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"

export default {
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
      geofenceId: null,
      geofenceDetail: {
        id: null,
        name: "",
        docking_cost: null,
        geofences: []
      },
      center: [-6.097643, 106.802428],
      colors: [
        { border: "yellow", fill: "yellow" },
        { border: "blue", fill: "#3951ce8f" },
        { border: "green", fill: "lightgreen" },
        { border: "purple", fill: "violet" },
        { border: "orange", fill: "lightorange" },
        { border: "red", fill: "pink" }
      ],

      selectedHours: null,
      selectedMinutes: null,
      hourOptions: [],
      minuteOptions: []
    }
  },

  computed: {
    formattedDockingCost() {
      return this.formatCurrency(this.geofenceDetail.docking_cost)
    }
  },
  created() {
    this.geofenceId = this.$route.params.geofenceId
    this.fetchGeofenceDetail(this.geofenceId), this.generateMultiplierOptions()
  },

  methods: {
    async fetchGeofenceDetail(geofenceId) {
      const config = {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      }

      try {
        const response = await axios.get("api/v1/setting/web", config)
        const allSettings = response.data.data.zone || []

        // Loop through allSettings and add borderColor and fillColor
        allSettings.forEach((zone, index) => {
          const color = this.colors[index % this.colors.length]

          zone.borderColor = color.border
          zone.fillColor = color.fill
        })
        console.log("💚 ALL ZONE", allSettings)

        // SEARCH ZONE BY ID
        const geofenceDetail = allSettings.find((zone) => zone.id === parseInt(geofenceId))
        const otherGeofence = allSettings.filter((zone) => zone.id !== parseInt(geofenceId))

        // Set selected hours and minutes
        this.selectedHours = Math.floor(geofenceDetail.cost_multiplier / 60)
        this.selectedMinutes = geofenceDetail.cost_multiplier % 60

        this.geofenceDetail = geofenceDetail
        this.otherGeofence = otherGeofence

        this.$nextTick(() => {
          this.initGeoDetail(geofenceDetail, otherGeofence)
        })

        console.log("💚 ZONE DETAIL", geofenceDetail)
        console.log("💚 ZONE OTHER", otherGeofence)

        // --
      } catch (error) {
        console.log("💥 Failed to Fetch Geofence Detail", error)
      }
    },

    async initGeoDetail(geoDetail, otherGeofences) {
      // Initialize the map
      const mapInstance = L.map("detail-geofence-map", { preferCanvas: true, zoomControl: false, attributionControl: true })
        .setView(this.center, 15)
        .addLayer(
          // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          // https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
          // https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
          // https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
          // https://api.mapbox.com/styles/v1/harlicuan/{style_id}/tiles/{tilesize}/{z}/{x}/{y}{@2x}
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxNativeZoom: 19,
            maxZoom: 30,
            minZoom: 10
          })
        )

      // Remove the default attribution text
      mapInstance.attributionControl.setPrefix(false)
      mapInstance.attributionControl.addAttribution('<a href="https://google.com">ManggaMap</a>')

      // Add zoom controls
      // L.control.zoom({ position: "topleft" }).addTo(map)

      // Animate map
      mapInstance.flyTo(this.center, 17, { duration: 2 })

      // Add language and polygon controls
      mapInstance.pm.setLang("id")
      mapInstance.pm.addControls({
        position: "topright",
        drawPolygon: false,
        removalMode: true,
        editMode: true,
        drawText: false,
        cutPolygon: false,
        drawMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawCircleMarker: false
      })

      // Call methods to create the polygons
      const layerGroup = L.featureGroup().addTo(mapInstance)
      this.createSelectedPolygon(mapInstance, geoDetail, layerGroup)
      this.createOtherPolygons(mapInstance, otherGeofences)
    },

    createSelectedPolygon(mapInstance, geoDetail, layerGroup) {
      const selectedGeofence = geoDetail.geofences.map((fence) => [fence.lat, fence.long])
      const GeoFill = geoDetail.fillColor
      const GeoBorder = geoDetail.borderColor

      L.polygon(selectedGeofence, {
        color: "red",
        fillColor: GeoFill,
        fillOpacity: 0.5
      }).addTo(mapInstance)

      const editSelectedPolygon = L.polygon(selectedGeofence, {
        // pmIgnore: true,
        color: GeoBorder,
        fillColor: GeoFill,
        fillOpacity: 0.5
      })

      layerGroup.addLayer(editSelectedPolygon)

      // Enable editing for the selected polygon
      layerGroup.pm.enable({ allowSelfIntersection: true })

      const updatePolygonCoordinates = () => {
        this.updatedPolygon = editSelectedPolygon.getLatLngs()[0].map(({ lat, lng }) => ({
          lat: lat.toFixed(6),
          long: lng.toFixed(6)
        }))

        console.log("Updated Coordinates:", this.updatedPolygon)
      }

      // Handle map events: create, drag, remove, and cut polygons_______________________________
      layerGroup.on({
        "pm:create": (e) => {
          console.log("Polygon Created:", e.layer._latlngs[0])
          //   updateTransformedArray(e.layer._latlngs[0])
        },
        "pm:cut": (e) => {
          console.log("Polygon Cut:", e.originalLayer._latlngs[0])
          updatePolygonCoordinates(e.originalLayer._latlngs[0])
        },
        "pm:markerdragend": (e) => {
          // console.log("Marker Drag Ended:", e.layer._latlngs[0])
          // updateTransformedArray(e.layer._latlngs[0])
        },
        "pm:remove": (e) => {
          console.log("Polygon Removed:")
          updatePolygonCoordinates()
        },
        "pm:edit": (e) => {
          console.log("Polygon Edited")
          updatePolygonCoordinates() // Update coordinates after editing
        }
      })
    },

    createOtherPolygons(mapInstance, otherGeofences) {
      // Iterate over other geofences and add polygons
      otherGeofences.forEach((otherGeo) => {
        const otherGeofence = otherGeo.geofences.map((fence) => [fence.lat, fence.long])
        const otherGeoFill = otherGeo.fillColor
        const otherGeoBorder = otherGeo.borderColor

        L.polygon(otherGeofence, {
          color: otherGeoBorder,
          fillColor: otherGeoFill,
          fillOpacity: 0.5
        }).addTo(mapInstance)
      })
    },

    async saveGeofence() {
      // Validation
      if (!this.geofenceDetail.name || !this.geofenceDetail.docking_cost || this.selectedHours === null || this.selectedMinutes === null) {
        alert("Please fill in all fields correctly.")
        return
      }

      // Show SweetAlert confirmation before saving
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan menyimpan zona ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Proses",
        cancelButtonText: "Batal",
        reverseButtons: true
      })

      // Check if the user confirmed
      if (result.isConfirmed) {
        // Calculate total cost_multiplier in minutes
        const totalCostMultiplier = (this.selectedHours || 0) * 60 + (this.selectedMinutes || 0)

        // Prepare data
        const dataToSend = {
          id: this.geofenceDetail.id,
          name: this.geofenceDetail.name,
          docking_cost: parseInt(this.geofenceDetail.docking_cost),
          cost_multiplier: parseInt(totalCostMultiplier),
          geofences: this.geofenceDetail.geofences
        }

        console.log("Send >", dataToSend)

        try {
          const response = await axios.put(`/api/v1/setting/update-zone/${this.geofenceDetail.id}`, dataToSend, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          console.log("Geofence saved successfully:", response.data)
          Swal.fire("Sukses!", "Zona telah diupdate.", "success")
        } catch (error) {
          console.error("Error update geofence detail:", error)
          Swal.fire("Gagal!", "Tidak dapat mengupdate zona. Silakan coba lagi.", "error")
        }
      }
    },

    // STYLING_______________________________________________________________
    generateMultiplierOptions() {
      for (let i = 0; i <= 10; i++) {
        this.hourOptions.push({ value: i, label: `${i} jam` })
      }

      for (let i = 1; i <= 59; i++) {
        this.minuteOptions.push({ value: i, label: `${i} menit` })
      }
    },

    formatCurrency(value) {
      if (!value) return ""
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    // Update the actual value from the formatted input
    updateDockingCost(event) {
      const value = event.target.value.replace(/\./g, "") // Remove dots before storing
      this.geofenceDetail.docking_cost = parseInt(value, 10) || 0 // Update model
    }
  }
}
</script>

<style>
html {
  overflow: hidden;
}

/* Hide the flag icon */
.leaflet-attribution-flag {
  display: none; /* This will hide the flag */
}
.leaflet-control-attribution a {
  color: black;
  /* font-weight: bold; */
}

@media (max-width: 370px) {
  .leaflet-top.leaflet-right {
    position: absolute !important;
    bottom: 20px;
    left: 20px;
    right: auto;
    top: auto;
  }
}

.btn-setting {
  display: none;
}
</style>
