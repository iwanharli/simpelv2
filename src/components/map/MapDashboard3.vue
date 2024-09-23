<template>
  <div id="dashboardMap" style="height: 100%; width: 100%;"></div>
</template>

<script>
import { onMounted } from "vue"
import L from "leaflet"
import axios from "axios"
import AOS from "aos"
import Swal from "sweetalert2"
import "leaflet.markercluster"
import "leaflet/dist/leaflet.css"
import markerKapal from "@/assets/images/ship-marker.png"
import markerNelayan from "@/assets/images/fisherman-marker.png"

export default {
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

  methods: {
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
