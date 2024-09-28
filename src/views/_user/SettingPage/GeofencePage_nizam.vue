<template>
  <div class="card-body p-0">
    <div class="bg-secondary" style="padding: 20px">
      <div class="d-flex justify-content-center">
        <router-link :to="{ name: 'admin.setting-geofence-nizamZachman', params: { id: '919191' } }" class="btn btn-info ml-2">NIZAM ZACHMAN</router-link> &nbsp; &nbsp;
        <router-link :to="{ name: 'admin.setting-geofence-tegalsari', params: { id: '929292' } }" class="btn btn-info">TEGALSARI</router-link>
      </div>
    </div>

    <!-- Map Container -->
    <div id="map" ref="map" @ready="initializeMap" style="">
      <div class="map-buttons-container">
        <button class="btn btn-md btn-map-custom-edit p-3" @click="onSaveButtonClick()">SIMPAN</button>
        <button class="btn btn-md btn-warning btn-map-custom-reset p-3" type="submit" @click="resetSetting()">RESET</button>
      </div>

      
      <div id="loading" style="display: none">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"

export default {
  data() {
    return {
      map: null,
      mobileSettings: {},
      harbourCode: "",
      harbourName: "",
      appMode: "",
      appInterval: "",
      appRange: "",
      adminContact: "",
      appVersion: "",
      appUrl: "",
      appGeofence: [],
      fixGeofence: [],
      transformedArray: []
    }
  },

  mounted() {
    this.getSettingApp()

    setTimeout(() => {
      this.toggleMapTab()
    }, 500)
  },

  methods: {
    toggleMapTab() {
      if (!this.mapInitialized) {
        // Update the map
        this.showLoading()
        setTimeout(() => {
          this.initializeMap()
          this.hideLoading() // Hide the loading spinner after 1 second
        }, 500)
        this.mapInitialized = true
      }
    },

    async getSettingApp() {
      await axios
        .get("api/v1/setting/web", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          const appSetting = res.data.data

          this.harbourCode = appSetting.harbour_code
          this.harbourName = appSetting.harbour_name
          this.adminContact = appSetting.admin_contact
          this.appMode = appSetting.mode
          this.appInterval = appSetting.interval
          this.appRange = appSetting.range
          this.appVersion = appSetting.apk_min_version
          this.appUrl = appSetting.apk_min_download
          this.costMultiplier = appSetting.cost_multiplier
          this.dockingCost = appSetting.docking_cost
          this.appGeofence = appSetting.geofences

          // console.clear()
          console.log("GEOFENCE FETCHED", this.appGeofence)
        })
        .catch((error) => {
          setTimeout(this.getSettingApp, 1000)
          // console.error("Error: " + error.response.data.meta.message)
        })
    },

    async initializeMap() {
      let mapContainer = document.getElementById("map")

      // Ensure the container exists before proceeding
      if (!mapContainer) {
        console.error("Map container not found!")
        return // Exit if the container doesn't exist
      }

      // Clear existing map instance if exists
      if (this.mapInstance) {
        this.mapInstance.off() // Remove all event listeners
        this.mapInstance.remove() // Remove the map instance
        this.mapInstance = null // Reset map reference
      }

      // Convert geofence to the proper format
      this.fixGeofence = this.appGeofence.map(({ lat, long }) => [parseFloat(lat), parseFloat(long)])

      const latlng = [-6.097643, 106.802428]

      // Initialize map with tiles and basic configurations
      const map = L.map("map", { preferCanvas: true, zoomControl: false })
        .setView(latlng, 17)
        .addLayer(
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxNativeZoom: 19,
            maxZoom: 30,
            minZoom: 10
          })
        )

      // Add zoom controls to the map
      L.control.zoom({ position: "topleft" }).addTo(map)

      // Animate map to the initial coordinates
      map.flyTo(latlng, 16, { duration: 1 })

      // Set map language and add controls for polygon drawing and editing
      map.pm.setLang("id")
      map.pm.addControls({
        position: "topright",
        drawPolygon: true,
        removalMode: true,
        editMode: true,
        drawMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawCircleMarker: false,
        drawText: false,
        cutPolygon: true
      })

      // Create static polygon (red) for existing geofence
      const staticPolygon = L.polygon(this.fixGeofence, {
        pmIgnore: true,
        color: "red",
        fillColor: "#A1B4FF",
        fillOpacity: 0
      }).addTo(map)

      // Create an editable polygon layer group
      const editablePolygon = L.polygon(this.fixGeofence)
      const layerGroup = L.featureGroup([editablePolygon]).addTo(map)

      // Enable polygon editing
      layerGroup.pm.enable({ allowSelfIntersection: false })

      // Shared logic for handling polygon changes
      const updateTransformedArray = (coords) => {
        this.transformedArray = coords.map(({ lat, lng }) => ({
          lat: `${lat}`,
          long: `${lng}`
        }))
      }

      // Handle map events: create, drag, remove, and cut polygons
      layerGroup.on({
        "pm:create": (e) => updateTransformedArray(e.layer._latlngs[0]),
        "pm:markerdragend": (e) => updateTransformedArray(e.layer._latlngs[0]),
        "pm:remove": () => {
          this.transformedArray = [{ lat: "0", long: "0" }]
        },
        "pm:cut": (e) => updateTransformedArray(e.originalLayer._latlngs[0])
      })

      // Store references to polygons and map instance for later removal
      this.mapInstance = map
      this.staticPolygon = staticPolygon
      this.editableLayerGroup = layerGroup
    },

    async onSaveButtonClick() {
      // Show SweetAlert confirmation before saving
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan menyimpan geofence baru!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Proses",
        cancelButtonText: "Batal",
        reverseButtons: true
      })

      if (result.isConfirmed) {
        this.toggleMapTab()
        // console.log(this.transformedArray)

        const updatedData = {
          harbour_code: parseInt(this.harbourCode),
          harbour_name: this.harbourName,
          admin_contact: this.adminContact,
          mode: this.appMode,
          apk_min_version: this.appVersion,
          interval: parseInt(this.appInterval),
          range: parseInt(this.appRange),
          docking_cost: parseInt(this.dockingCost),
          cost_multiplier: this.costMultiplier,
          apk_download_link: this.appUrl,
          geofence: this.transformedArray
        }

        axios
          .post("api/v1/setting/create-or-update", updatedData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            }
          })
          .then((response) => {
            console.log("Data updated successfully", response)

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer
                toast.onmouseleave = Swal.resumeTimer
              }
            })
            Toast.fire({
              icon: "success",
              title: "Berhasil Ubah Geofence"
            })

            // Remove the old static geofence (red) from the map
            if (this.mapInstance && this.staticPolygon) {
              this.mapInstance.removeLayer(this.staticPolygon)
            }

            // Update the map
            this.showLoading()
            setTimeout(() => {
              this.hideLoading() // Hide the loading spinner after 1 second
            }, 500)
          })
          .catch((error) => {
            console.error("Error updating data:", error)
          })
      } else {
        console.log("Canceled by user")
      }
    },

    async resetSetting() {
      // Show SweetAlert confirmation before resetting
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan mengatur ulang geofence pengaturan ke default!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Reset",
        cancelButtonText: "Batal",
        reverseButtons: true
      })

      if (result.isConfirmed) {
        // Show loading spinner
        document.getElementById("loading").style.display = "flex"

        // INITIAL Default Coordinates
        const coordinate = [
          { long: "106.803074", lat: "-6.09461" },
          { long: "106.804399", lat: "-6.101957" },
          { long: "106.802454", lat: "-6.102295" },
          { long: "106.802025", lat: "-6.099767" },
          { long: "106.800907", lat: "-6.099951" },
          { long: "106.800569", lat: "-6.097961" },
          { long: "106.801896", lat: "-6.097703" },
          { long: "106.801927", lat: "-6.097885" },
          { long: "106.802047", lat: "-6.097862" },
          { long: "106.802012", lat: "-6.0975" },
          { long: "106.800553", lat: "-6.097762" },
          { long: "106.799995", lat: "-6.09472" },
          { long: "106.799802", lat: "-6.094763" },
          { long: "106.800151", lat: "-6.09654" },
          { long: "106.798911", lat: "-6.096732" },
          { long: "106.798452", lat: "-6.094331" },
          { long: "106.799541", lat: "-6.093491" },
          { long: "106.800445", lat: "-6.092827" },
          { long: "106.800574", lat: "-6.092497" },
          { long: "106.801432", lat: "-6.091878" }
        ]

        // UPDATING API with Default Coordinates
        const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
        const updatedData = {
          harbour_code: parseInt(this.harbourCode),
          harbour_name: this.harbourName,
          admin_contact: this.adminContact,
          mode: this.appMode,
          apk_min_version: this.appVersion,
          interval: parseInt(this.appInterval),
          range: parseInt(this.appRange),
          docking_cost: parseInt(this.dockingCost),
          cost_multiplier: this.costMultiplier,
          apk_download_link: this.appUrl,
          geofence: coordinate
        }

        try {
          const response = await axios.post("api/v1/setting/create-or-update", updatedData, config)
          console.log("🚀 RESET SUCCESS", response)

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer
              toast.onmouseleave = Swal.resumeTimer
            }
          })
          Toast.fire({
            icon: "success",
            title: "Berhasil Reset Geofence"
          })

          // Update local component state with the default coordinates
          this.transformedArray = coordinate
          this.appGeofence = coordinate

          // Reload the page to reflect changes
          setTimeout(() => {
            location.reload()
          }, 1000) // Optional: add delay before reloading
        } catch (error) {
          console.error("💥 RESET FAILED:", error)
        }

        console.log("FORM HAS BEEN RESET")
      } else {
        console.log("Reset canceled by user")
      }
    },

    showLoading() {
      const loadingDiv = document.getElementById("loading")
      loadingDiv.style.display = "flex" // Show the loading spinner
    },

    hideLoading() {
      const loadingDiv = document.getElementById("loading")
      loadingDiv.style.display = "none" // Hide the loading spinner
    }
  }
}
</script>

<style>
.card-body {
  position: relative;
  height: 100%; /* Make the card-body stretch to full height */
}

#map {
  min-height: 87vh;
  position: relative;
}

.map-buttons-container {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  /* justify-content: space-between; */
  background: #21252994;
  bottom: 0;
  left: 0;
  right: 0;
  gap: 100px;
  padding: 30px;
  border-radius: 20px 20px 0px 0px;
  z-index: 5000;
}

.btn-map-custom-edit {
  background: #3a57e8;
  width: 50%;
  height: 50%;
  border-radius: 20px;
  border: 3px solid white;
  color: white;
  font-weight: 600;
}

.btn-map-custom-edit:hover {
  background: #334dcc;
  color: white;
  border: 3px solid white;
}

.btn-map-custom-reset {
  background: #f16a1b;
  width: 50%;
  height: 50%;
  border-radius: 20px;
  border: 4px solid white;
  color: white;
  font-weight: 600;
}

.btn-map-custom-reset:hover {
  background: #cd5916;
  color: white;
  border: 4px solid white;
}

/* LOADING  */
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000ba;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
