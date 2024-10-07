<template>
  <div style="position: relative; height: 70vh">
    <div id="mapDetail" style="height: 100%; width: 100%; border-radius: 20px; z-index: 0"></div>

    <div class="col-xl-6 col-md-6 cols-sm-12 mx-auto" style="position: absolute; top: 93%; left: 50%; transform: translate(-50%, -50%); z-index: 1">
      <div class="row" style="background-color: #83838357; padding: 10px; border-radius: 10px; border: 1px solid white">
        <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12">
          <div class="input-group input-daterange" id="bs-datepicker-daterange">
            <input type="date" placeholder="MM/DD/YYYY" class="form-control" v-model="dateStart" />
            <span class="input-group-text">to</span>
            <input type="date" placeholder="MM/DD/YYYY" class="form-control" v-model="dateEnd" />
          </div>
        </div>

        <div class="col-xl-4 col-lg-12 col-md-12 col-sm-12">
          <button class="btn btn-warning d-grid w-100" type="submit" @click="filterHistory()">Lihat History</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import markerKapal from "@/assets/images/ship-marker.png"
import markerNelayan from "@/assets/images/fisherman-marker.png"
import markerStart from "@/assets/images/start.png"
import markerFinish from "@/assets/images/finish.png"

import axios from "axios"
import { onMounted } from "vue"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

export default {
  name: "MapShipDetail",

  props: {
    shipCurLat: Number,
    shipCurLong: Number,
    shipOnGround: Number,
    locationLogs: Number,
    shipName: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      required: true
    },
    responsibleName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },

  data() {
    // Function to format date as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }

    // Get the current date
    const currentDate = new Date()

    // Calculate the date for a week ago
    const weekAgoDate = new Date(currentDate)
    weekAgoDate.setDate(weekAgoDate.getDate() - 7)

    return {
      dateStart: formatDate(weekAgoDate),
      dateEnd: formatDate(currentDate),
      shipMarker: null
    }
  },

  mounted() {
    this.initMaps()
  },

  methods: {
    async initMaps() {
      const harborCenter = { lat: -6.097643, lng: 106.802428 }

      this.leaflet_map = await L.map("mapDetail", {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: false
      }).setView([harborCenter.lat, harborCenter.lng], 17)

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxNativeZoom: 19,
        maxZoom: 30,
        minZoom: 5
      }).addTo(this.leaflet_map)

      // After flying to the harbor, fly to the ship's position
      setTimeout(() => {
        this.setMarkerPosition()
      }, 4000)

      this.getGeofence()
    },

    async getGeofence() {
      await axios
        .get("api/v1/setting/web", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          const zones = res.data.data.zone
          console.log("💚 ZONES__", zones)

          // Define variable to store the center of the harbor zone
          let harborCenter = null

          zones.forEach((zone, index) => {
            if (Array.isArray(zone.geofences) && zone.geofences.length > 0) {
              const geofenceCoords = zone.geofences
                .map((geofence) => {
                  const lat = parseFloat(geofence.lat)
                  const long = parseFloat(geofence.long)

                  // Check if lat and long are valid numbers
                  if (isNaN(lat) || isNaN(long)) {
                    console.error(`Invalid geofence coordinates: lat=${geofence.lat}, long=${geofence.long}`)
                    return null // Return null for invalid coordinates
                  }

                  return [lat, long]
                })
                .filter((coords) => coords !== null) // Remove invalid coordinates

              // console.log(`Zone ${zone.name} coordinates:`, geofenceCoords);

              if (geofenceCoords.length > 0) {
                // Define colors for the polygon
                const colors = [
                  { border: "yellow", fill: "yellow" },
                  { border: "blue", fill: "#3951ce8f" },
                  { border: "green", fill: "lightgreen" },
                  { border: "purple", fill: "violet" },
                  { border: "orange", fill: "lightorange" },
                  { border: "red", fill: "pink" }
                ]

                // Choose a color based on the index
                const colorIndex = index % colors.length
                const selectedColor = colors[colorIndex]

                // Draw the polygon on the map
                L.polygon(geofenceCoords, {
                  color: selectedColor.border,
                  fillColor: selectedColor.fill,
                  fillOpacity: 0.5
                }).addTo(this.leaflet_map)

                console.log(`💚 GEOFENCE added ${zone.name}___`)
              } else {
                console.warn(`⚠️ No valid geofence coordinates found for zone ${zone.name}`)
              }
            } else {
              console.warn(`⚠️ Geofences not found or invalid for zone ${zone.name}`)
            }
          })

          this.setMarkerPosition()
        })
        .catch((error) => {
          console.log("💥 FAILED GET GEOFENCE")
          return
        })
    },

    async setMarkerPosition() {
      this.leaflet_map.flyTo([this.shipCurLat, this.shipCurLong], 18, {
        duration: 3
      })

      // Set marker icons
      var iconKapal = L.icon({
        iconUrl: markerKapal,
        iconSize: [22, 42],
        iconAnchor: [16, 32]
      })

      var iconNelayan = L.icon({
        iconUrl: markerNelayan,
        iconSize: [35, 50]
      })

      var icon = this.shipOnGround === 1 ? iconNelayan : iconKapal
      this.shipMarker = L.marker([this.shipCurLat, this.shipCurLong], { icon: icon }).addTo(this.leaflet_map)
    },

    async filterHistory() {
      if (this.leaflet_map) {
        this.leaflet_map.eachLayer(function (layer) {
          console.log("tanda", layer)
        })
      }

      console.log(this.dateStart, "-", this.dateEnd)
      this.removePreviousMarkersAndPolyline()

      if (this.locationLogs) {
        const filteredLogs = this.locationLogs.filter((log) => {
          const dateLog = log.created_at.split(" ")[0]
          return (!this.dateStart || dateLog >= this.dateStart) && (!this.dateEnd || dateLog <= this.dateEnd)
        })

        console.log("logList", filteredLogs)

        const Toast = Swal.mixin({
          toast: true,
          position: "top-center",
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
          title: `Get ${filteredLogs.length} lokasi`
        })

        const firstLog = filteredLogs[filteredLogs.length - 1]
        const lastLog = firstLog

        console.log("📍START", firstLog)
        console.log("🚩END", lastLog)

        const iconKapal = L.icon({
          iconUrl: markerKapal,
          iconSize: [35, 50]
        })

        const iconNelayan = L.icon({
          iconUrl: markerNelayan,
          iconSize: [35, 50]
        })

        const markers = []

        filteredLogs.forEach((log) => {
          const { lat, long, on_ground } = log
          const icon = on_ground === 1 ? iconNelayan : iconKapal

          const marker = L.marker([parseFloat(lat), parseFloat(long)], { icon: icon })
          markers.push(marker)
          marker.addTo(this.leaflet_map)

          marker.on("click", () => {
            this.leaflet_map.flyTo([parseFloat(lat), parseFloat(long)], 18, {
              duration: 1
            })
          })
        })

        if (markers.length > 0) {
          const firstMarker = markers[0]
          const lastMarker = markers[markers.length - 1]

          lastMarker.setIcon(L.icon({ iconUrl: markerStart, iconSize: [70, 70] }))
          firstMarker.setIcon(L.icon({ iconUrl: markerFinish, iconSize: [70, 70] }))

          lastMarker.setZIndexOffset(1000)
          firstMarker.setZIndexOffset(1001)
        }

        // Create a polyline using the coordinates of the markers
        const polyline = L.polyline(
          markers.map((marker) => marker.getLatLng()),
          { dashArray: "5, 5", color: "blue" }
        ).addTo(this.leaflet_map)

        this.markers = markers
        this.polyline = polyline
      } else {
        console.warn("⚠️ DOCK LOGS NULL / UNDEFINED:")

        const Toast = Swal.mixin({
          toast: true,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer
            toast.onmouseleave = Swal.resumeTimer
          }
        })
        Toast.fire({
          icon: "warning",
          title: "Log Kapal Kosong"
        })
      }
    },

    removePreviousMarkersAndPolyline() {
      this.leaflet_map.removeLayer(this.shipMarker)

      // Remove previous markers
      if (this.markers && this.markers.length > 0) {
        this.markers.forEach((marker) => {
          this.leaflet_map.removeLayer(marker)
        })
      }

      // Remove previous polyline
      if (this.polyline) {
        this.leaflet_map.removeLayer(this.polyline)
      }
    }
  }
}
</script>

<style>
.custom-icon-class {
  font-size: 20px;
}
</style>
