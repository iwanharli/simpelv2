<template>
  <div class="simpel-map-container">
    <!-- <div id="mapDashboard" style="z-index: 0px !important"></div> -->

    <div id="shipDetailsDiv" class="simpel-ship-detail"></div>

    <a class="btn btn-fixed-end btn-secondary btn-icon btn-setting" id="arrivalBtn" v-if="!muncul" v-on:click="toggleArrival()" style="border-radius: 20px 0px 0px 20px; border: 2px solid white">
      <div class="animated-scale" style="font-size: 22px">🚢</div>
    </a>

    <div id="shipArrival" :class="['simpel-ship-arrival', 'inspeksi-mobile', 'bg-soft-light', muncul ? 'show' : '']">
      <button v-on:click="toggleArrival()" id="insideArrivalBtn">X</button>
      <b-card-header class="bg-secondary text-light pb-4" style="border-radius: 0px 20px 0px 0px">
        <div class="header-title p-3">
          <b-row>
            <b-col xl="6" lg="6" md="12" sm="12">
              <h6 style="font-weight: bold; color: white">KEDATANGAN KAPAL TERBARU</h6>
            </b-col>
            <b-col xl="6" lg="6" md="12" sm="12" class="d-flex justify-content-end">
              <RouterLink :to="{ name: 'admin.arrival' }">
                <button class="btn btn-sm btn-primary text-white mt-0" type="button" id="kapal_detail" @click="downloadCSV">SEMUA KEDATANGAN ></button>
              </RouterLink>
            </b-col>
          </b-row>
        </div>
      </b-card-header>
      <div class="card-body p-0">
        <div class="table-responsive" style="overflow: hidden">
          <table id="basic-table" class="table table-border mb-0" role="grid" style="border-radius: 0px 0px 20px 20px">
            <thead>
              <tr class="bg-solid-secondary text-secondary">
                <th style="font-weight: bolder; width: 3px" class="text-center">ID</th>
                <th style="font-weight: bolder">NAMA KAPAL</th>
                <th style="font-weight: bolder" class="text-center">CHECKIN</th>
                <th style="width: 5%"></th>
              </tr>
            </thead>
            <tbody>
              <!-- Check if pendingList has data -->
              <tr v-if="!this.shipArrival">
                <td colspan="6" class="bg-soft-secondary">Data kosong</td>
              </tr>

              <tr v-for="(item, index) in this.shipArrival" :key="index++" v-else>
                <td class="text-center bg-solid-light" style="font-weight: bolder">
                  {{ index }}
                </td>
                <td class="bg-solid-light" style="text-transform: uppercase; font-weight: bolder">
                  {{ item.ship_name }}
                </td>
                <td class="bg-solid-light text-center">
                  {{ item.checkin_date }}
                </td>
                <td class="text-center bg-solid-light">
                  <span class="badge bg-info ml-2 p-1" style="font-size: 10px; width: 100%">
                    INSPEKSI &nbsp;
                    <span class="circle-dashboard" style="background-color: green" v-if="item.is_inspected === 1"></span>
                    <span class="circle-dashboard" style="background-color: red" v-else></span>
                  </span>
                  <br />
                  <span class="badge bg-info ml-2 p-1 mt-1" style="font-size: 10px; width: 100%">
                    REPORT &nbsp;
                    <span class="circle-dashboard" style="background-color: green" v-if="item.is_reported === 1"></span>
                    <span class="circle-dashboard" style="background-color: red" v-else></span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet"
import axios from "axios"
import AOS from "aos"
import Swal from "sweetalert2"
import "leaflet.markercluster"
import "leaflet/dist/leaflet.css"
import markerKapal from "@/assets/images/ship-marker.png"
import markerNelayan from "@/assets/images/fisherman-marker.png"

export default {
  name: "MapDashboard",
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
      stats: [],
      center: { lat: -6.097643, lng: 106.802428 },
      shipArrival: [],
      leaflet_map: null,
      leaflet_markers: {},
      leaflet_layerGroups: null,
      harbour_name: "PELABUHAN",
      socket: null,
      harbour_geo: [],
      selectedShip: [],
      ship_collection: [],
      muncul: false,
      token: localStorage.getItem("token"),
      ws_url: `ws://103.179.86.246:9016/api/v1/dashboard/ship-monitor/open-websocket`
    }
  },

  mounted() {
    this.initializeMap()
    this.initializeWebSocket()
    this.fetchShipDocking()
  },

  unmounted() {
    if (this.socket) this.socket.close()
  },

  methods: {
    toggleArrival() {
      this.muncul = !this.muncul
    },

    /*****************/
    async fetchShipDocking() {
      try {
        const config = { headers: { Authorization: `Bearer ${this.token}` } }
        const res = await axios.get("/api/v1/dashboard/lastest-dock-ship", config)
        this.shipArrival = res.data.data
      } catch (error) {
        console.error("Error fetching ship arrival data:", error)
      }
    },

    async initializeMap() {
      await this.fixMapZoomAnimation()
      const tileUrls = {
        street: "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=ufCf3dbMdr7VkfVI6gjQ"
      }

      this.leaflet_map = L.map("dashboardMap", { zoomControl: false }).setView([this.center.lat, this.center.lng], 15)

      L.tileLayer(tileUrls.street, {
        maxNativeZoom: 19,
        maxZoom: 30,
        minZoom: 12,
        noWrap: true
      }).addTo(this.leaflet_map)

      L.control.zoom({ position: "topleft" }).addTo(this.leaflet_map)

      this.leaflet_layerGroups = L.markerClusterGroup().addTo(this.leaflet_map)

      this.fetchAppSettings()
    },

    async fetchAppSettings() {
      try {
        const config = { headers: { Authorization: `Bearer ${this.token}` } }
        const res = await axios.get("api/v1/setting/web", config)
        this.harbour_name = res.data.data.harbour_name
        this.harbour_geo = res.data.data.geofences
        this.drawHarbourGeofence()
      } catch (error) {
        console.error("Error fetching app settings:", error)
      }
    },

    drawHarbourGeofence() {
      if (Array.isArray(this.harbour_geo)) {
        const geofenceCoords = this.harbour_geo.map((item) => [item.lat, item.long])
        L.polygon(geofenceCoords, {
          color: "rgba(0, 0, 255, 0.8)", // Blue for the border
          fillColor: "rgba(0, 0, 240, 0.5)", // Blue for the fill with transparency
          fillOpacity: 0.4
        }).addTo(this.leaflet_map)

        console.log("💚 GEOFENCE SET")
      }
    },

    async updateMarker(ship) {
      try {
        const { ship_id, geo, on_ground, ship_name, device_id } = ship
        const timestamp = new Date().toLocaleString()

        if (this.leaflet_markers[ship_id]) {
          this.leaflet_markers[ship_id].setLatLng([geo[1], geo[0]])

          // SHIP WS INFO -------------------------------------------------------
          console.log(`> UPDATE MARKER 🚥🚥🚥
          Time: ${timestamp}
          Ship ID: ${ship.ship_id}
          Ship Name: ${ship.ship_name}
          Device ID: ${ship.device_id}
          Coordinates: [Lat: ${ship.geo[1]}, Lng: ${ship.geo[0]}]
          On Ground: ${ship.on_ground ? "Yes" : "No"}
          Is Update: ${ship.is_update ? "Yes" : "No"}
          `)
          // SHIP WS INFO --------------------------------------------------------
        } else {
          const icon = on_ground === 1 ? L.icon({ iconUrl: markerNelayan, iconSize: [35, 50] }) : L.icon({ iconUrl: markerKapal, iconSize: [22, 42], iconAnchor: [16, 32] })

          const marker = L.marker([geo[1], geo[0]], { icon })
            .addTo(this.leaflet_layerGroups)
            .on("click", () => this.showShipDetails(ship))

          this.leaflet_markers[ship_id] = marker
        }
      } catch (error) {
        console.error("💥 Error updating marker:", error)
      }
    },

    showShipDetails(ship) {
      const currentUrl = window.location.href.replace("dashboard", "ship")
      const shipDetailHtml = `
        <div class='table-responsive p-3'>
          <table id="basic-table" class="table mb-0" role="grid">
            <thead>
              <tr class="bg-secondary">
                <th style="font-weight: bolder; width: 5px; color: white; font-size: 20px;" class="text-center" colspan=2>DETAIL KAPAL</th>
              </tr>
            </thead>
            <tbody class="bg-secondary">
              <tr><td class="text-white" style='font-weight: bolder; width: 20%;'>ID</td><td class="text-white">${ship.ship_id}</td></tr>
              <tr><td class="text-white" style='font-weight: bolder;'>KAPAL</td><td class="text-white">${ship.ship_name}</td></tr>
              <tr><td class="text-white" style='font-weight: bolder;'>DEVICE</td><td class="text-white">${ship.device_id}</td></tr>
              <tr><td colspan="2"><a href="${currentUrl}/${ship.ship_id}" class="btn btn-sm btn-primary" type="button" style='width:100%'><i class="ti ti-search me-sm-1"></i> DETAIL</a></td></tr>
              <tr><td colspan="2"><button class="btn btn-sm btn-danger close-btn" type="button" style='width:100%'><i class="ti ti-close me-sm-1"></i> CLOSE</button></td></tr>
            </tbody>
          </table>
        </div>
      `

      const shipDetailsDiv = document.getElementById("shipDetailsDiv")
      shipDetailsDiv.innerHTML = shipDetailHtml
      shipDetailsDiv.style.display = "block"

      document.querySelector(".close-btn").addEventListener("click", () => {
        shipDetailsDiv.style.display = "none"
      })
    },

    async initializeWebSocket() {
      try {
        this.socket = new WebSocket(this.ws_url)
        this.socket.onopen = () => console.log("📶 WEBSOCKET CONNECTED___", this.ws_url)
        this.socket.onmessage = (message) => this.processSocketData(message)
        this.socket.onerror = (error) => console.error("WebSocket error:", error)
        this.socket.onclose = (event) => {
          console.log(event.code === 1000 ? "WebSocket disconnected" : `WebSocket disconnected with code ${event.code}`)
          if (event.code !== 1000) setTimeout(() => this.initializeWebSocket(), 5000)
        }
      } catch (error) {
        console.error("💥 WebSocket connection error:", error)
        if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.close()
        setTimeout(() => this.initializeWebSocket(), 5000)
      }
    },

    async processSocketData(message) {
      const jsonData = JSON.parse(message.data)
      if (jsonData) {
        jsonData.forEach((ship) => this.updateMarker(ship))
      }
    },

    async fixMapZoomAnimation() {
      L.Popup.prototype._animateZoom = L.Tooltip.prototype._animateZoom = function (e) {
        if (!this._map) return
        const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center)
        this._setPosition(pos)
      }

      L.Marker.prototype._animateZoom = function (e) {
        if (!this._map) return
        const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round()
        this._setPos(pos)
      }
    }
  }
}
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css");

.container-dashboard {
  position: relative;
  top: 0;
}

.simpel-map-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  left: 0;
}

.circle-dashboard {
  border-radius: 50%;
  width: 8px;
  height: 8px;
  display: inline-block;
  border: 1px solid black;
}

#btnResetMap {
  width: 33px;
  height: 33px;
  line-height: 30px;
  position: absolute;
  z-index: 99999;
  left: 9px;
  top: 80px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #88a9b2;
  line-height: 26px;
  display: block;
  text-align: center;
  text-decoration: none;
  color: #fff;
  border-radius: 3px;
}

.marker-cluster-small {
  background-color: rgba(181, 226, 140, 0.8);
}
.marker-cluster-small div {
  background-color: #605ac2;
}
.marker-cluster-medium {
  background-color: rgba(241, 211, 87, 0.8);
}
.marker-cluster-medium div {
  background-color: rgba(240, 194, 12, 0.8);
}
.marker-cluster-large {
  background-color: rgba(253, 156, 115, 0.8);
}
.marker-cluster-large div {
  background-color: rgba(241, 128, 23, 0.8);
}
.leaflet-oldie .marker-cluster-small {
  background-color: #b5e28c;
}
.leaflet-oldie .marker-cluster-small div {
  background-color: #6ecc39;
}
.leaflet-oldie .marker-cluster-medium {
  background-color: #f1d357;
}
.leaflet-oldie .marker-cluster-medium div {
  background-color: #f0c20c;
}
.leaflet-oldie .marker-cluster-large {
  background-color: #fd9c73;
}
.leaflet-oldie .marker-cluster-large div {
  background-color: #f18017;
}
.marker-cluster {
  background-clip: padding-box;
  border-radius: 20px;
  border: 3px solid steelblue;
  animation: pulse-animation 2s infinite;
}
.marker-cluster div {
  width: 30px;
  height: 30px;
  margin-left: 3px;
  margin-top: 3px;
  text-align: center;
  border-radius: 15px;
  font: 1.3em "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-weight: bold !important;
}
.marker-cluster span {
  line-height: 30px;
}

.custom-tooltip {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  border-collapse: collapse;
  table-layout: fixed;
  width: 200px;
}

.leaflet-top,
.leaflet-bottom {
  z-index: 0px;
}

.leaflet-control-container {
  display: none;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgb(255, 187, 50);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}
</style>
