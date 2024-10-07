<template>
  <div class="p-0" style="position: relative; height: 93.5vh; width: 100%">
    <div class="card-body card-custom" v-if="geofenceDetail" data-aos="fade-right" data-aos-delay="500">
      <div class="row container-custom">
        <div class="form col-lg-3 col-md-6 col-12">
          <label style="color: white; margin-bottom: 10px"><strong>Nama Zona</strong></label>
          <input type="text" id="geofenceName" class="form-control" v-model="geofenceDetail.name" />
        </div>
        <div class="form col-lg-3 col-md-6 col-12">
          <label style="color: white; margin-bottom: 10px"><strong>Biaya</strong></label>
          <input type="number" id="dockingCost" class="form-control" v-model="geofenceDetail.docking_cost" />
        </div>
        <div class="form col-lg-4 col-md-12 col-12">
          <label style="color: white; margin-bottom: 10px"><strong>Waktu</strong></label>
          <div class="d-flex time">
            <select id="costMultiplierHours" class="form-control me-2" v-model="selectedHours">
              <option :value="selectedHours" disabled style="display: none">
                {{ selectedHours ? `${selectedHours} jam` : "Pilih Jam" }}
              </option>
              <option v-for="option in hourOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <select id="costMultiplierMinutes" class="form-control" v-model="selectedMinutes">
              <option :value="selectedMinutes" disabled style="display: none">
                {{ selectedMinutes ? `${selectedMinutes} menit` : "Pilih Menit" }}
              </option>
              <option v-for="option in minuteOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="buttonContainer col-lg-2 col-md-12 col-sm-12">
          <button class="btn btn-map-custom-edit p-0" @click="saveGeofence()">SIMPAN</button>
        </div>
      </div>
    </div>

    <!-- MAP  -->
    <div id="detail-geofence-map" style="height: 100%; width: 100%" data-aos="fade" data-aos-delay="100"></div>
  </div>
</template>

<script>
import axios from "axios"
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
      const mapInstance = L.map("detail-geofence-map", { preferCanvas: true, zoomControl: false })
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
          lat: `${lat}`,
          long: `${lng}`
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

      // Calculate total cost_multiplier in minutes
      const totalCostMultiplier = (this.selectedHours || 0) * 60 + (this.selectedMinutes || 0)

      // Prepare data
      const dataToSend = {
        id: this.geofenceDetail.id,
        name: this.geofenceDetail.name,
        docking_cost: this.geofenceDetail.docking_cost,
        cost_multiplier: totalCostMultiplier,
        geofences: this.geofenceDetail.geofences
      }

      console.log("Send >", dataToSend)

      //   try {
      //     // Replace with your actual API endpoint
      //     const response = await this.$http.post("/api/geofences", dataToSend)
      //     console.log("Geofence saved successfully:", response.data)

      //     // Optionally clear the form or navigate
      //     this.geofenceDetail = { name: "", docking_cost: null, cost_multiplier: null }
      //   } catch (error) {
      //     console.error("Error saving geofence:", error)
      //     alert("There was an error saving the geofence. Please try again.")
      //   }
    },

    // STYLING_______________________________________________________________
    generateMultiplierOptions() {
      for (let i = 0; i <= 10; i++) {
        this.hourOptions.push({ value: i, label: `${i} jam` })
      }

      for (let i = 1; i <= 59; i++) {
        this.minuteOptions.push({ value: i, label: `${i} menit` })
      }
    }
  }
}
</script>

<style>
@media (max-width: 1031px) {
  .leaflet-top.leaflet-right {
    position: absolute !important;
    bottom: 20px;
    left: 20px;
    right: auto;
    top: auto;
  }
}

@media (max-width: 991.3px) {
  .btn-map-custom-edit {
    height: 50px !important;
    width: 30% !important;
  }

  .form {
    margin-bottom: 20px !important;
  }

  .d-flex.time {
    gap: 15px !important;
  }
}

@media (max-width: 460px) {
  .btn-map-custom-edit {
    height: 50px !important;
    width: 100% !important;
  }
}

.card-custom {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0px;
}

.container-custom {
  background: #2f5f8985;
  padding: 30px 50px 30px 50px;
  border-radius: 0px 0px 20px 0px;
  border: 5px solid #00000047;
  border-top: none;
}

.buttonContainer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.btn-map-custom-edit {
  background: #f16a1b;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  border: 3px solid white;
  color: white;
  font-weight: 600;
  transition: background 0.5s ease;
}

.btn-map-custom-edit:hover {
  background: red;
  color: white;
  border: 3px solid white;
}

.btn-map-custom-edit:focus {
  outline: none;
  background: red;
  border: 3px solid white;
  color: white;
}

.btn-map-custom-edit:active {
  background: red;
  border: 3px solid white;
  color: white;
}
</style>
