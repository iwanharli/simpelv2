<template>
  <div id="map" class="simpel-map-container">
    <div id="map" style="z-index: 0px !important"></div>

    <div id="shipDetailsDiv" class="simpel-ship-detail"></div>

    <a class="btn btn-fixed-end btn-secondary btn-icon btn-setting" id="arrivalBtn" v-if="!muncul" v-on:click="toggleArrival()" style="border-radius: 20px 0px 0px 20px; border: 2px solid white">
      <div class="animated-scale" style="font-size: 22px">🚢</div>
    </a>

    <div id="shipArrival" :class="['simpel-ship-arrival', 'inspeksi-mobile', 'bg-soft-light', muncul ? 'show' : '']">
      <button v-on:click="toggleArrival()" id="insideArrivalBtn">X</button>
      <b-card-header class="bg-secondary text-light pb-4">
        <div class="header-title">
          <b-row>
            <b-col xl="6" lg="6" md="12" sm="12">
              <h6 style="font-weight: bold; color: white">KEDATANGAN KAPAL TERBARU</h6>
            </b-col>
            <b-col xl="6" lg="6" md="12" sm="12" class="d-flex justify-content-end">
              <RouterLink :to="{ name: 'admin.arrival' }">
                <button class="btn btn-sm btn-primary text-white" style="margin-top: 0px !important" type="button" id="kapal_detail" @click="downloadCSV">SEMUA KEDATANGAN ></button>
              </RouterLink>
            </b-col>
          </b-row>
        </div>
      </b-card-header>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table id="basic-table" class="table table-border mb-0" role="grid">
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
import Swal from "sweetalert2"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"

import markerKapal from "@/assets/images/ship-marker.png"
import markerNelayan from "@/assets/images/fisherman-marker.png"

export default {
  name: "MapDashboard",
  data() {
    return {
      stats: [],
      // center: { lat: -6.846155, lng: 109.128892 }, 
      center: { lat: -6.097643, lng: 106.802428 }, 
      shipArrival: [],

      leaflet_map: null,
      leaflet_markers: [],
      leaflet_layerGroups: null,
      harbour_name: "PELABUHAN",

      socket: null,
      harbour_geo: [],
      selectedShip: [],
      ship_collection: [],
      muncul: false,
      // ws_url: "ws://localhost:8080",
      // ws_url: "ws://103.179.86.243:9016/api/v1/dashboard/ship-monitor/open-websocket"

      token: localStorage.getItem("token"),
      // ws_url: `ws://103.179.86.243:9016/api/v1/dashboard/ship-monitor/websocket?Authorization=Bearer ${token}`
      ws_url: `ws://103.179.86.246:9016/api/v1/dashboard/ship-monitor/open-websocket`
    }
  },

  mounted() {
    setTimeout(() => {
      this.akuPeta()
      this.ws_container()
    }, 10)

    this.getShipDocking()

    console.log("MAP DASHBOARD > token", localStorage.getItem("token"))
  },

  unmounted() {
    console.log("tutup")
    this.socket.close()
  },

  methods: {
    toggleArrival() {
      this.muncul = !this.muncul
      console.clear()
      console.log("muncul ??", this.muncul)
    },

    /*****************/
    async getShipDocking() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("/api/v1/dashboard/lastest-dock-ship", config)
        .then((res) => {
          this.shipArrival = res.data.data

          // console.clear()
          console.log("💚 SHIP ARRIVAL FETCHED", this.shipArrival)
        })
        .catch((error) => {
          console.error("💥 SHIP ARRIVAL ERROR :", error)
        })
    },

    async akuPeta() {
      // console.log("PETA", L, [this.center.lat, this.center.lng])

      await this.mapZoomAnimFix()

      const tileOcean = "https://api.maptiler.com/maps/ocean/{z}/{x}/{y}.png?key=ufCf3dbMdr7VkfVI6gjQ"
      const tileTopo = "https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key=ufCf3dbMdr7VkfVI6gjQ"
      const street = "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=ufCf3dbMdr7VkfVI6gjQ"

      this.leaflet_map = await L.map("map", {
        zoomControl: false
      }).setView([this.center.lat, this.center.lng], 13)

      L.tileLayer(street, {
        maxNativeZoom: 19,
        maxZoom: 30,
        minZoom: 12,
        noWrap: true
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.leaflet_map)

      L.control
        .zoom({
          position: "topleft"
        })
        .addTo(this.leaflet_map)

      // L.marker([this.center.lat, this.center.lng])
      //   .addTo(this.leaflet_map)
      //   .bindPopup(this.harbour_name)
      //   .openPopup()

      // this.leaflet_layerGroups = L.layerGroup().addTo(this.leaflet_map)
      this.leaflet_layerGroups = L.markerClusterGroup().addTo(this.leaflet_map)

      this.getAppSetting()
    },

    async harbourEditor(geofence) {
      console.log("---------------------------------")
      console.log("💚 GEOFENCE SET")
      var fix_geofence
      if (geofence !== null && Array.isArray(geofence)) {
        fix_geofence = geofence.map((item) => [item.lat, item.long])
      } else {
        fix_geofence = [] // or any other default value that fits your use case
      }

      L.polygon(fix_geofence, {
        color: "#7367F0",
        fillColor: "#A1B4FF",
        fillOpacity: 0.5
      }).addTo(this.leaflet_map)
    },

    async markerEditor(ship) {
      try {
        if (this.leaflet_markers.hasOwnProperty(ship.ship_id)) {
          // Jika marker sudah ada, perbarui posisinya
          this.leaflet_markers[ship?.ship_id].setLatLng([ship?.geo[1], ship?.geo[0]])

          console.log("> UP MARKER \t", ship.ship_id, "🚥", ship.ship_name, "🚥", ship.device_id, "🚥", ship.geo, "\n> ON GROUND \t", ship.on_ground, "\n> IS UPDATE \t", ship.is_update)
        } else {
          // Jika marker belum ada, buat marker baru dan tambahkan ke LayerGroup
          var iconKapal = L.icon({
            iconUrl: markerKapal,
            iconSize: [22, 42],
            iconAnchor: [16, 32]
          })

          var iconNelayan = L.icon({
            iconUrl: markerNelayan,
            iconSize: [35, 50]
          })

          // console.log(ship)

          var marker = L.marker([ship.geo[1], ship.geo[0]], {
            icon: ship.on_ground === 1 ? iconNelayan : iconKapal
          })
            .addTo(this.leaflet_layerGroups)
            .on("click", function () {
              var currentUrl = window.location.href.replace("dashboard", "ship")

              // console.log(currentUrl)
              document.getElementById("shipDetailsDiv").innerHTML = ""

              const shipDetail = document.createElement("div")

              shipDetail.innerHTML = `
                <div class='table-responsive p-3'>
                  <table id="basic-table" class="table mb-0" role="grid">
                    <thead>
                    <tr class="bg-secondary">
                      <th style="font-weight: bolder; width: 5px; color: white; font-size: 20px;" class="text-center" colspan=2>DETAIL KAPAL</th>
                    </tr>
                  </thead>
                  <tbody class="bg-secondary">
                    <tr>
                      <td class="text-white" style='font-weight: bolder; width: 20%;'>ID</td>
                        <td class="text-white">${ship.ship_id}</td>
                      </tr>
                    <tr>
                      <td class="text-white" style='font-weight: bolder;'>KAPAL</td>
                      <td class="text-white">${ship.ship_name}</td>
                    </tr>
                    <tr>
                      <td class="text-white" style='font-weight: bolder;'>DEVICE</td>
                      <td class="text-white">${ship.device_id}</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <a href="${currentUrl}/${ship.ship_id}" class="btn btn-sm btn-primary" type="button" style='width:100%'>
                          <i class="ti ti-search me-sm-1"></i> DETAIL
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <button class="btn btn-sm btn-danger close-btn" type="button" style='width:100%'>
                          <i class="ti ti-close me-sm-1"></i> CLOSE
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              `

              document.getElementById("shipDetailsDiv").appendChild(shipDetail)
              document.getElementById("shipDetailsDiv").style.display = "block"

              // Attach event listener to the close button
              document.querySelector(".close-btn").addEventListener("click", function () {
                document.getElementById("shipDetailsDiv").style.display = "none"
              })

              // console.log(document.getElementById("shipDetailsDiv"))
            })

          this.leaflet_markers[ship.ship_id] = marker

          // console.log(
          //   'create marker kapal',
          //   ship.ship_id,
          //   ship.ship_name,
          //   ' - koordinat ',
          //   ship.geo
          // )
        }
      } catch (error) {
        console.log("💥 ERROR ADD MARKER", error)
      }
    },

    goToShipDetail() {
      // Use Vue Router to navigate to ship detail page
      this.$router.push({ name: "admin.shipDetail", params: { shipId: this.ship.ship_id } })
    },

    clickZoom(e) {
      this.leaflet_map.flyTo(e.target.getLatLng(), 25, {
        duration: 3
      })
    },

    resetMap() {
      this.leaflet_map.setView([this.center.lat, this.center.lng], 15)
    },

    /******************** */
    async prosesSocketData(data) {
      var data = data.data
      var json_data = JSON.parse(data)

      if (json_data === null) {
        return
      } else {
        json_data.forEach((ship) => {
          this.markerEditor(ship)
        })
      }
      // console.clear()
      // console.log("test", json_data)
    },

    async ws_container() {
      await this.ws_konek_donk()
      // await this.ws_test()
    },

    async ws_konek_donk() {
      try {
        this.socket = new WebSocket(this.ws_url, null, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })

        // return;

        // jika sebelumnya sudah konek
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log("CONNECTION ACTIVE")
          return
        }

        // konek ke server
        this.socket = new WebSocket(this.ws_url)

        // kalau ada error
        this.socket.onerror = (error) => {
          console.error("💥 WEBSOCKET ERROR:", error)
        }

        // awal konek
        this.socket.onopen = () => {
          // console.clear()
          console.log("📶 WEBSOCKET CONNECTED")
        }

        // kalau ada pesan
        this.socket.onmessage = (message) => {
          // console.log('Pesan diterima:', message.data)
          this.prosesSocketData(message)
        }

        // kalau ditutup
        this.socket.onclose = (event) => {
          if (event.code === 1000) {
            // putus tp baik2
            console.log("🗿 WEBSOCKET DISCONNECTED SUCCESS.")
          } else {
            // putus karena gak direstui
            console.log("💥 WEBSOCKET DISCONNECTED CODE:", event.code)
            // setTimeout(this.ws_konek_donk, 5000) // coba rujuk ulang setelah x detik
          }
        }
      } catch (error) {
        console.log("💥 ERROR :", error)

        // jika error saat koneksi berjalan, putuskan koneksi yg berjalan
        if (this.socket && this.socket?.readyState === WebSocket.OPEN) {
          // console.log("Koneksi sudah aktif. putusin aja")
          this.socket.close()
          return
        }

        // agar tiap ws tutup / gagal dia akan konek ulang setelah x detik
        // setTimeout(this.ws_container(), 5000)
      }
    },

    ws_test() {
      console.log("TEST WS :", this.socket)
    },

    /***********************************/
    // get this when api socket is request

    getAppSetting() {
      axios
        .get("api/v1/setting/web", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          this.harbour_name = res.data.data.harbour_name
          this.harbour_geo = res.data.data.geofences

          this.harbourEditor(this.harbour_geo)
        })
        .catch((error) => {
          console.log("💥 GET APP SETTING ERROR :", error)
        })
    },

    mapZoomAnimFix() {
      L.Popup.prototype._animateZoom = function (e) {
        if (!this._map) {
          return
        }
        var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
          anchor = this._getAnchor()
        L.DomUtil.setPosition(this._container, pos.add(anchor))
      }

      L.Tooltip.prototype._animateZoom = function (e) {
        if (!this._map) {
          return
        }

        var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center)
        this._setPosition(pos)
      }

      L.Tooltip.prototype._updatePosition = function (e) {
        if (!this._map) {
          return
        }

        var pos = this._map.latLngToLayerPoint(this._latlng)
        this._setPosition(pos)
      }

      L.Marker.prototype._animateZoom = function (e) {
        if (!this._map) {
          return
        }
        var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round()

        this._setPos(pos)
      }
    }
  }
}
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css");

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

/* Optional: Style for the button */
.btn-primary {
  /* margin-top: 10px; */
}

.leaflet-top,
.leaflet-bottom {
  z-index: 0px;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgb(255, 187, 50);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

.inspeksi-mobile {
  max-width: 550px;
  overflow: auto;
  margin-top: 20px;
  margin-right: 20px;
}

@media only screen and (max-width: 600px) {
  .inspeksi-mobile {
    max-width: 400px;
  }
}

@media only screen and (max-width: 400px) {
  .inspeksi-mobile {
    max-width: 200px;
  }
}
</style>
