<template>
  <b-row class="p-5">
    <!-- MAP DETAIL  -->
    <b-col xl="12" class="bg-transparent" v-if="shipCurLat !== 0">
      <div style="border-radius: 20px">
        <MapDetail :shipCurLat="shipCurLat" :shipCurLong="shipCurLong" :shipOnGround="shipOnGround" :location-logs="locationLogs" v-if="shipCurLat && shipCurLong" />

        <div xl="12" class="bg-soft-danger d-flex align-items-center justify-content-center p-4 pt-5" style="border-radius: 20px; flex-direction: column; gap: 20px" v-if="!shipCurLat || !shipCurLong">
          <img src="@/assets/images/nf.png" class="next" style="width: 60px; height: 60px" />
          <h5 class="text-white mb-3" style="font-weight: bolder">LOKASI KAPAL MASIH KOSONG</h5>
        </div>
      </div>
    </b-col>

    <!-- ISI  -->
    <b-col lg="6">
      <b-col lg="12" class="mt-4">
        <b-card no-body>
          <b-card-header header-class="d-flex justify-content-between bg-primary">
            <div class="header-title">
              <h4 class="card-title text-white p-2" style="font-weight: bolder">DETAIL KAPAL</h4>
            </div>
          </b-card-header>
          <b-card-body class="p-2">
            <div class="table-responsive scrollbar">
              <table class="table" style="padding: 10px 1.5rem !important">
                <tbody class="text-black">
                  <tr>
                    <th style="width: 5px;"><i class="ti ti-ship"></i></th>
                    <th style="width: 40%; font-weight: bolder">NAMA KAPAL</th>
                    <td>
                      {{ formatShipStatus(ship.ship_name) }}
                    </td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-check"></i></th>
                    <th style="font-weight: bolder">STATUS</th>
                    <td style="text-transform: uppercase">
                      <div class="badge bg-primary pt-2 pb-2" v-if="ship.status === 'checkin'">
                        <span>{{ ship.status }}</span>
                      </div>
                      <div class="badge bg-info pt-2 pb-2" v-else-if="ship.status === 'checkout'">
                        <span>{{ ship.status }}</span>
                      </div>
                      <div class="badge bg-warning pt-1 pb-1" v-else-if="ship.status === 'out of scope'">
                        <span>{{ ship.status }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-user"></i></th>
                    <th style="font-weight: bolder">PENANGGUNG JAWAB</th>
                    <td>{{ formatShipStatus(ship.responsible_name) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-phone-call"></i></th>
                    <th style="font-weight: bolder">DEVICE</th>
                    <td>{{ ship.device_id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
        </b-card>
      </b-col>

      <b-col lg="12" class="mt-4">
        <b-card no-body>
          <b-card-header header-class="bg-primary" style="padding: 15px !important;">
            <div class="header-title">
              <b-row style="padding-right: 0px; padding-left: 0px">
                <b-col xl="10" lg="10" md="9" sm="9">
                  <h4 class="card-title text-white p-2 ms-auto" style="font-weight: bolder">BIODATA KAPAL</h4>
                </b-col>
                <b-col xl="2" lg="2" md="3" sm="3">
                  <a class="btn btn-sm btn-info p-2 mt-1" type="button" data-bs-toggle="modal" data-bs-target="#modalEditDetailKapal" style="width: 100%">
                    <i class="ti ti-adjustments-alt"></i> EDIT
                  </a>
                </b-col>
              </b-row>
            </div>
          </b-card-header>
          <b-card-body class="p-2">
            <div class="table-responsive scrollbar">
              <table class="table" style="padding: 10px 1.5rem !important">
                <tbody class="text-black">
                  <tr>
                    <th style="width: 10%"><i class="ti ti-user"></i></th>
                    <th style="width: 40%; font-weight: bolder">PEMILIK KAPAL</th>
                    <td>{{ formatShipStatus(shipBio.owner_name) }}</td>
                  </tr>
                  <tr>
                    <th style="width: 10%"><i class="ti ti-route-2"></i></th>
                    <th style="width: 40%; font-weight: bolder">JENIS</th>
                    <td>{{ formatShipStatus(shipBio.type) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-shape"></i></th>
                    <th style="font-weight: bolder">DIMENSI (m)</th>
                    <td>{{ formatShipStatus(shipBio.dimension) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-directions"></i></th>
                    <th style="font-weight: bolder">PELABUHAN PANGKALAN</th>
                    <td>{{ formatShipStatus(shipBio.harbour) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-directions"></i></th>
                    <th style="font-weight: bolder">GT</th>
                    <td>{{ formatShipStatus(shipBio.gt) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-align-box-bottom-center-filled"></i></th>
                    <th style="font-weight: bolder">NOMOR SIUP</th>
                    <td>{{ formatShipStatus(shipBio.siup) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-align-box-bottom-right-filled"></i></th>
                    <th style="font-weight: bolder">NOMOR BKP</th>
                    <td>{{ formatShipStatus(shipBio.bkp) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-align-box-center-middle-filled"></i></th>
                    <th style="font-weight: bolder">TANDA SELAR</th>
                    <td>{{ formatShipStatus(shipBio.selar_mark) }}</td>
                  </tr>
                  <tr>
                    <th><i class="ti ti-calendar"></i></th>
                    <th style="font-weight: bolder">TERDAFTAR</th>
                    <td>{{ formatShipStatus(ship.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-col>

    <!-- HISTORY KAPAL  -->
    <b-col lg="6" class="mt-4">
      <b-card no-body class="bg-white">
        <b-card-header header-class="d-flex justify-content-between bg-primary">
          <div class="header-title">
            <h4 class="card-title text-white p-2" style="font-weight: bolder">HISTORI LABUH KAPAL</h4>
          </div>
        </b-card-header>
        <b-card-body class="scrollbar" style="max-height: 798px !important; overflow-y: auto">
          <div class="iq-timeline0 m-0 d-flex align-items-center justify-content-between position-relative" v-if="this.dockLogs && this.dockLogs.length > 0">
            <ul class="list-inline p-0 m-0">
              <li v-for="(dockLog, index) in this.dockLogs" :key="index++">
                <div class="timeline-item">
                  <div class="timeline-dots1 border-primary text-primary" v-if="dockLog.status === 'checkin'">
                    <i class="ti ti-transfer-in" style="font-size: larger"></i>
                  </div>
                  <div class="timeline-dots1 border-danger text-danger" v-else>
                    <i class="ti ti-transfer-out" style="font-size: larger"></i>
                  </div>

                  <div class="timeline-content">
                    <h6 class="mb-1" style="text-transform: uppercase; display: inline-block">{{ dockLog.status }}</h6>
                    -
                    <small class="float-right mt-1">{{ dockLog.created_at }}</small>
                    <div class="d-inline-block w-100">
                      <p>PPP TEGALSARI</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="p-2 text-dark" v-else>
            <p>KAPAL INI BELUM MEMILIKI HISTORI ⛵</p>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>

  <modalEditKapal />
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted, ref } from "vue"

import MapDetail from "@/components/map/MapShipDetail.vue"
import ModalEditKapal from "@/components/modal/EditDetailKapal.vue"

export default {
  name: "detailKapal",

  components: {
    MapDetail,
    ModalEditKapal
  },

  data() {
    return {
      id: 0,
      zoom: 16,
      ship: {},
      shipBio: {},
      dockLogs: [],
      locationLogs: [],
      shipCurLat: null,
      shipCurLong: null,
      shipOnGround: null
    }
  },

  created() {
    const shipDetailId = this.$route.params.shipId
    this.getShipDetail(shipDetailId), this.getDockLogs(shipDetailId), this.getLocationLogs(shipDetailId)
  },

  methods: {
    async getShipDetail(shipDetailId) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get(`/api/v1/ship/detail/${shipDetailId}`, config)
        .then((res) => {
          this.ship = res.data.data
          this.shipBio = this.ship.detail

          if (!this.ship.current_lat || !this.ship.current_long) {
            return
          }

          this.shipCurLat = this.ship.current_lat
          this.shipCurLong = this.ship.current_long
          this.shipOnGround = this.ship.on_ground

          console.log("💚 SHIP DETAIL :", shipDetailId, this.ship)

          // console.log("asd", this.shipCurLat, this.shipCurLong)
        })
        .catch((error) => {
          // Swal.fire({
          //   title: "Error!",
          //   text: "Mencoba lagi dalam 5 detik",
          //   icon: "error",
          // })

          console.log("Get ship detail failure. Retrying in 5 seconds...", error)

          // setTimeout(() => {
          //   this.getShipDetail()
          // }, 5000)
          return
        })
    },

    async getDockLogs(shipDetailId) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get(`/api/v1/ship/dock-log/${shipDetailId}`, config)
        .then((res) => {
          this.dockLogs = res.data.data.docking_logs

          this.dockLogs = res.data.data.docking_logs.map((log) => {
            const date = new Date(log.created_at)
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

            const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

            return {
              ...log,
              formattedDate: formattedDate
            }
          })

          console.log("💚 DOCK LOGS >", this.dockLogs)
        })
        .catch((error) => {
          console.log("💚 DOCK LOGS >", this.dockLogs)
        })
    },

    async getLocationLogs(shipDetailId) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get(`/api/v1/ship/location-log/${shipDetailId}`, config)
        .then((res) => {
          this.locationLogs = res.data.data.location_logs

          console.log("💚 LOCATION LOGS >", this.locationLogs)
        })
        .catch((error) => {
          console.error("💥 LOCATION LOGS GAGAL :", error)
        })
    },

    // STYLING
    formatShipStatus(status) {
      if (status) {
        return status.toUpperCase()
      } else {
        return "" // Handle the case when status is undefined
      }
    },

    getBadgeClass(status) {
      if (status === "checkin") {
        return "bg-success"
      } else if (status === "checkout") {
        return "bg-info"
      } else if (status === "out of scope") {
        return "bg-warning"
      } else {
        return "bg-danger"
      }
    },

    getArrowClass(status) {
      if (status === "checkin") {
        return "fa-solid fa-circle-arrow-down"
      } else if (status === "checkout") {
        return "fa-solid fa-circle-arrow-up"
      } else if (status === "out of scope") {
        return "badge bg-label-warning"
      } else {
        return "badge bg-label-danger"
      }
    }
  }
}
</script>

<style>
.scrollbar::-webkit-scrollbar {
  width: 10px;
}

.scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #3c50a1;
  border-radius: 6px;
}

/* For Firefox */
.scrollbar {
  scrollbar-color: #888 #f1f1f1;
  scrollbar-width: thin;
}
</style>
