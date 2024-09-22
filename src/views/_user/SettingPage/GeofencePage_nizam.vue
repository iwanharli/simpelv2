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
        <button class="btn btn-md btn-map-custom-edit p-3" @click="onSaveButtonClick()">UBAH GEOFENCE</button>
        <button class="btn btn-md btn-warning btn-map-custom-reset p-3" type="submit" @click="resetSetting()">RESET</button>
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
        this.initializeMap()
        this.mapInitialized = true
      }
    },

    async initializeMap() {
      this.fixGeofence = this.appGeofence.map((item) => [parseFloat(item.lat), parseFloat(item.long)])

      this.fixGeofence.forEach((coordinate, index) => {
        const [latitude, longitude] = coordinate
        // console.log(`Index: ${index}, Lat: ${latitude}, Long: ${longitude}`)
      })

      const latlng = [-6.097643, 106.802428]
      const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxNativeZoom: 19,
        maxZoom: 30,
        minZoom: 10
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })

      const map = L.map("map", { preferCanvas: true, zoomControl: false }).setView(latlng, 17).addLayer(tiles)

      L.control
        .zoom({
          position: "topleft"
        })
        .addTo(map)

      map.flyTo(latlng, 15, {
        duration: 2
      })

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

      const p1 = L.polygon(this.fixGeofence, {
        pmIgnore: true,
        color: "red",
        fillColor: "#A1B4FF",
        fillOpacity: 0
      })
      const pEdit = L.polygon(this.fixGeofence)
      const layerGroup = L.featureGroup([p1, pEdit]).addTo(map)

      layerGroup.addLayer(pEdit)

      map.on("pm:create", (e) => {
        console.log(e.layer._latlngs[0])

        const addPolygon = e.layer._latlngs[0]
        this.transformedArray = addPolygon.map((coordinate) => ({
          long: `${coordinate.lng}`,
          lat: `${coordinate.lat}`
        }))
      })

      layerGroup.on("pm:markerdragend", (e) => {
        console.log(e.layer._latlngs[0])

        const editedPolygon = e.layer._latlngs[0]
        // layerGroup.bindPopup(`<p>${JSON.stringify(editedPolygon)}</p>`)

        this.transformedArray = editedPolygon.map((coordinate) => ({
          long: `${coordinate.lng}`,
          lat: `${coordinate.lat}`
        }))
      })

      layerGroup.on("pm:remove", (e) => {
        // console.log(e)
        this.transformedArray = [{ long: "0", lat: "0" }]
      })

      layerGroup.on("pm:cut", (e) => {
        console.log(e.originalLayer._latlngs[0])

        const cuttedPolygon = e.layer._latlngs[0]
        // layerGroup.bindPopup(`<p>${JSON.stringify(editedPolygon)}</p>`)

        this.transformedArray = cuttedPolygon.map((coordinate) => ({
          long: `${coordinate.lng}`,
          lat: `${coordinate.lat}`
        }))
      })

      layerGroup.pm.enable({
        allowSelfIntersection: false
      })
    },

    onSaveButtonClick() {
      this.toggleMapTab()
      console.log(this.transformedArray)

      const updatedData = {
        harbour_code: parseInt(this.harbourCode),
        harbour_name: this.harbourName,
        mode: this.appMode,
        interval: parseInt(this.appInterval),
        range: parseInt(this.appRange),
        admin_contact: "081802796414",
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

          setTimeout(() => {
            location.reload(true)
          }, 2000)
        })
        .catch((error) => {
          console.error("Error updating data:", error)
        })
    },

    async getSettingApp() {
      await axios
        .get("api/v1/setting/web", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          this.harbourCode = res.data.data.harbour_code
          this.harbourName = res.data.data.harbour_name
          this.appMode = res.data.data.mode
          this.appInterval = res.data.data.interval
          this.appRange = res.data.data.range
          this.appVersion = res.data.data.apk_min_version
          this.appUrl = res.data.data.apk_min_download

          this.appGeofence = res.data.data.geofences

          // console.clear()
          console.log("DATA SETTING FETCHED", res)
        })
        .catch((error) => {
          setTimeout(this.getSettingApp, 1000)

          // console.error("Error: " + error.response.data.meta.message)
        })
    },

    async resetSetting() {
      // INITIAL
      this.harbourCode = 919191
      this.harbourName = "PELABUHAN NIZAM ZACHMAN"
      this.appMode = "interval"
      this.appInterval = 30
      this.appRange = 2
      this.adminContact = "081802796414"
      const coordinate = [
        { long: "106.803055", lat: "-6.094595" },
        { long: "106.804399", lat: "-6.101957" },
        { long: "106.802454", lat: "-6.102295" },
        { long: "106.802025", lat: "-6.099767" },
        { long: "106.800907", lat: "-6.099951" },
        { long: "106.800569", lat: "-6.097961" },
        { long: "106.801896", lat: "-6.097703" },
        { long: "106.801929", lat: "-6.097895" },
        { long: "106.802052", lat: "-6.097873" },
        { long: "106.802001", lat: "-6.097521" },
        { long: "106.800557", lat: "-6.097757" },
        { long: "106.800005", lat: "-6.094734" }
      ]

      // UPDATING
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        harbour_code: parseInt(this.harbourCode),
        harbour_name: this.harbourName,
        mode: this.appMode,
        apk_min_version: this.appVersion,
        interval: parseInt(this.appInterval),
        range: parseInt(this.appRange),
        admin_contact: this.adminContact,
        geofence: coordinate
      }

      await axios
        .post("api/v1/setting/create-or-update", updatedData, config)
        .then((response) => {
          Swal.fire({
            title: "Terimakasih!",
            text: "Setting telah berhasil direset 😊",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          })

          setTimeout(() => {
            location.reload(true)
          }, 2000)

          console.log("🚀 RESET SUCCESS", response)
        })
        .catch((error) => {
          console.error("💥 RESET FAILED:", error)
        })

      console.log("FORM HAS BEEN RESET")
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
</style>
