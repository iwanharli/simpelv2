<template>
  <div id="map_dashboard" class="simpel-map-container">
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
import axios from "axios"
import AOS from "aos"
import { onMounted } from "vue"

export default {
  name: "ShipArrival",
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

  methods: {
    /*****************/
    async fetchShipDocking() {
      try {
        const config = { headers: { Authorization: `Bearer ${this.token}` } }
        const res = await axios.get("/api/v1/dashboard/lastest-dock-ship", config)
        this.shipArrival = res.data.data

        console.log("💚 SHIP ARRIVAL", this.shipArrival)
      } catch (error) {
        console.error("💥 SHIP ARRIVAL Error: No valid data found in response")
      }
    },

    toggleArrival() {
      this.muncul = !this.muncul

      // Fetch ship docking data if the panel is about to be shown
      if (this.muncul) {
        this.fetchShipDocking()
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

/* ANIMATION  */
.blinking-marker {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.5), rgba(255, 255, 0, 0.5));
  border-radius: 50%;
  width: 35px; /* Set width to match iconSize */
  height: 50px; /* Set height to match iconSize */
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
