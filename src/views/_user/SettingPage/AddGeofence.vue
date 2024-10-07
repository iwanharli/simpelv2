<template>
  <b-row class="p-0">
    <b-col xl="12" class="bg-transparent" data-aos="fade" data-aos-delay="100">
      <div class="card" style="margin-bottom: 0px !important; height: 93.4vh">
        <b-card-header class="bg-primary text-light pb-4" style="border-radius: 0px">
          <div class="header-title">
            <b-row class="row d-flex justify-content-between">
              <b-col xl="8" lg="8" md="8" sm="8">
                <h4 style="font-weight: bold; color: white">TAMBAH ZONA</h4>
              </b-col>
              <b-col xl="4" lg="4" md="4" sm="4" class="d-flex justify-content-end">
                <!-- <button type="button" class="btn btn-sm btn-warning" style="display: inline-block; margin-left: 10px; border: 1px solid white; font-size: 17px" @click="saveGeofence">SIMPAN GEOFENCE</button> -->
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body bg-white" style="padding: 0px; position: relative" data-aos="fade-right" data-aos-delay="500">
          <div id="add-geofence-map" style="height: 100%; width: 100%" data-aos="fade" data-aos-delay="100"></div>

          <div style="background: #ffffffb0; height: auto; position: absolute; bottom: 0; right: 0; width: 300px; border-top: 5px solid white; border-left: 5px solid white; z-index: 10000">
            <div class="row d-flex align-items-center p-3">
              <!-- NAMA Section -->
              <div class="col-12 mb-3">
                <label for="dockingName" class="form-label" style="font-weight: bold">NAMA</label>
                <input type="text" id="dockingName" class="form-control" v-model="form.name" placeholder="Nama Zona" style="border: 2px solid #b2b2ff; width: 100%" />
              </div>

              <!-- BIAYA Section -->
              <div class="col-12 mb-3">
                <label for="dockingCost" class="form-label" style="font-weight: bold">BIAYA</label>
                <input type="text" id="dockingCost" class="form-control" v-model="form.docking_cost" placeholder="Biaya" style="border: 2px solid #b2b2ff; width: 100%"/>
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

  <div class="card-body card-custom p-0" style="position: absolute; height: 93.5vh; width: 100%; display: none" data-aos="fade-right" data-aos-delay="500">
    <div class="row container-custom" style="position: relative">
      <div class="form col-lg-3 col-md-6 col-12">
        <label style="color: white; margin-bottom: 10px"><strong>Nama Zona</strong></label>
        <input type="text" id="geofenceName" class="form-control" v-model="form.name" />
      </div>
      <div class="form col-lg-3 col-md-6 col-12">
        <label style="color: white; margin-bottom: 10px"><strong>Biaya</strong></label>
        <input type="number" id="dockingCost" class="form-control" v-model="form.docking_cost" />
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
    </div>
  </div>
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
      map: null,
      form: {
        id: null,
        name: "",
        docking_cost: null
      },
      geofencesArray: [],
      center: [-6.097643, 106.802428],

      selectedHours: null,
      selectedMinutes: null,
      hourOptions: [],
      minuteOptions: []
    }
  },
  mounted() {
    this.initGeoDetail(), this.generateMultiplierOptions()
  },

  methods: {
    async initGeoDetail() {
      const mapInstance = L.map("add-geofence-map", { preferCanvas: true, zoomControl: false })
        .setView(this.center, 15)
        .addLayer(
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
      mapInstance.pm.setLang("id")
      mapInstance.pm.addControls({
        position: "topright",
        drawPolygon: true,
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
      this.createPolygon(mapInstance, layerGroup)
    },

    createPolygon(mapInstance, layerGroup) {
      const updateTransformedArray = (layer) => {
        const transformedArray = layer._latlngs[0].map(({ lat, lng }) => {
          return {
            lat: lat.toFixed(6),
            long: lng.toFixed(6)
          }
        })

        console.log("Transformed Array:", transformedArray)
        this.geofencesArray = transformedArray // Now `this` refers to the outer context
      }

      mapInstance.on("pm:create", (e) => {
        console.log("Polygon Created:", e.layer._latlngs[0])
        layerGroup.addLayer(e.layer)

        updateTransformedArray(e.layer) // Call the function without the callback
      })

      mapInstance.on("pm:edit", (e) => {
        console.log("Polygon Edited:", e.layer._latlngs[0])
        updateTransformedArray(e.layer, (transformedArray) => {
          this.geofencesArray = transformedArray
        })
      })

      // Listen for the cut event (when a polygon is cut into two)
      mapInstance.on("pm:cut", (e) => {
        console.log("Polygon Cut:", e.originalLayer._latlngs[0])
        updateTransformedArray(e.originalLayer) // Update based on the original layer
      })

      // Listen for the marker drag end event
      mapInstance.on("pm:markerdragend", (e) => {
        console.log("Marker Drag Ended:", e.layer._latlngs[0])
        updateTransformedArray(e.layer) // Update after marker drag end
      })

      // Listen for the remove event (when a polygon is removed)
      mapInstance.on("pm:remove", (e) => {
        console.log("Polygon Removed")
        updateTransformedArray() // No layer needed as it's removed
      })
    },

    async saveGeofence() {
      // Validation
      if (!this.form.name || !this.form.docking_cost || this.selectedHours === null || this.selectedMinutes === null) {
        alert("Please fill in all fields correctly.")
        return
      }

      // Show SweetAlert confirmation before saving
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan menyimpan zona baru!",
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
          name: this.form.name,
          docking_cost: parseInt(this.form.docking_cost),
          cost_multiplier: parseInt(totalCostMultiplier),
          geofences: this.geofencesArray
        }

        console.log("Send >", dataToSend)

        try {
          const response = await axios.post("api/v1/setting/create-zone", dataToSend, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          console.log("Geofence saved successfully:", response.data)
          Swal.fire("Sukses!", "Zona telah disimpan.", "success")
        } catch (error) {
          console.error("Error saving geofence:", error)
          Swal.fire("Gagal!", "Tidak dapat menyimpan zona. Silakan coba lagi.", "error")
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
