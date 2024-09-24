<template>
  <b-row class="p-4">
    <!-- MAP DETAIL  -->
    <b-col xl="12" class="bg-transparent" v-if="shipCurLat !== 0">
      <div style="border-radius: 20px; box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5); border: 2px solid white">
        <MapDetail :shipCurLat="shipCurLat" :shipCurLong="shipCurLong" :shipOnGround="shipOnGround" :location-logs="locationLogs" :shipName="ship.ship_name" :ownerName="shipBio.owner_name" :responsibleName="ship.responsible_name" :status="ship.status" :openToastEditShipName="editShipName" v-if="shipCurLat && shipCurLong" />

        <div xl="12" class="bg-soft-danger d-flex align-items-center justify-content-center p-4 pt-5" style="border-radius: 20px; flex-direction: column; gap: 20px" v-if="!shipCurLat || !shipCurLong">
          <img src="@/assets/images/nf.png" class="next" style="width: 60px; height: 60px" />
          <h5 class="text-white mb-3" style="font-weight: bolder">LOKASI KAPAL MASIH KOSONG</h5>
        </div>
      </div>
    </b-col>
  </b-row>

  <!-- DETAIL KAPAL  -->
  <div class="row p-5 pt-3 pb-2">
    <b-col class="col-lg-3 col-md-6">
      <b-card class="hover-card" style="box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5); border-radius: 1px solid blue" @click="editShipName(ship.ship_name)">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img class="rounded img-fluid avatar-50 me-3 p-2" style="background: #0055be5c; box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" src="@/assets/images/icon/ship.png" loading="lazy" />
          </div>
          <div class="text-end">
            Nama Kapal
            <h5 style="font-weight: bold">{{ formatShipStatus(ship.ship_name) || "DATA KOSONG" }}</h5>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col class="col-lg-3 col-md-6">
      <b-card class="hover-card" style="box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" @click="editShipOwner(shipBio.owner_name)">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img class="rounded img-fluid avatar-50 me-3 p-2" style="background: #0055be5c; box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" src="@/assets/images/icon/owner.png" loading="lazy" />
          </div>
          <div class="text-end">
            Pemilik
            <h6 style="font-weight: bold">{{ formatShipStatus(shipBio.owner_name) || "DATA KOSONG" }}</h6>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col class="col-lg-3 col-md-6">
      <b-card class="hover-card" style="box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" @click="editShipResponsible(ship.responsible_name)">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img class="rounded img-fluid avatar-50 me-3 p-2" style="background: #0055be5c; box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" src="@/assets/images/icon/responsible.png" loading="lazy" />
          </div>
          <div class="text-end">
            Penanggung Jawab
            <h6 style="font-weight: bold">{{ formatShipStatus(ship.responsible_name) || "DATA KOSONG" }}</h6>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col class="col-lg-3 col-md-6">
      <b-card style="box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img class="rounded img-fluid avatar-50 me-3 p-2" style="background: #0055be5c; box-shadow: 0 4px 10px rgba(83, 83, 83, 0.5)" src="@/assets/images/icon/status.png" loading="lazy" />
          </div>
          <div class="text-end">
            Status <br />
            <div v-if="ship.status">
              <div class="badge bg-primary p-2" style="text-transform: capitalize" v-if="ship.status === 'checkin'">
                <span>{{ ship.status }}</span>
              </div>
              <div class="badge bg-info p-2" style="text-transform: capitalize" v-else-if="ship.status === 'checkout'">
                <span>{{ ship.status }}</span>
              </div>
              <div class="badge bg-warning p-2" style="text-transform: capitalize" v-else-if="ship.status === 'out of scope'">
                <span>{{ ship.status }}</span>
              </div>
            </div>
            <div v-else>
              <div class="badge bg-secondary p-2" style="text-transform: capitalize">
                <span>DATA KOSONG</span>
              </div>
            </div>
          </div>
        </div>
      </b-card>
    </b-col>
  </div>

  <div class="row p-5" style="padding-top: 0 !important">
    <!-- -->
    <div class="col-lg-6 col-md-6 col-12">
      <div class="row p-0">
        <!-- SPESIFIKASI KAPAL -->
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between" style="padding: 20px !important; background: #2366ca">
              <div class="header-title">
                <h4 class="card-title" style="font-weight: bold; color: white">SPESIFIKASI</h4>
                <small class="text-light" style="font-weight: normal">Memuat informasi tentang detail teknis kapal</small>
              </div>
              <div>
                <button class="btn btn-sm btn-warning text-light" style="margin-left: auto; height: 70%" type="button" data-bs-toggle="modal" data-bs-target="#modalEditDetailSpesifikasiKapal">
                  <i class="ti ti-adjustments-alt"></i>
                </button>
              </div>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table id="basic-table" class="table table-hover mb-0" role="grid">
                  <tbody>
                    <tr>
                      <td style="width: 40%">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/10.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Jenis</h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.type) }}</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/11.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6><span style="font-weight: bold; text-transform: uppercase">Dimensi </span><small>(m)</small></h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.dimension) }}</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/12.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">GT</h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.gt) }}</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/08.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">NOMOR GPS</h6>
                        </div>
                      </td>
                      <td>{{ shipBio.iot_phone }}</td>
                    </tr>
                    <tr>
                      <td style="border-bottom: none">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/07.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">IMEI</h6>
                        </div>
                      </td>
                      <td style="border-bottom: none">{{ ship.device_id }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- PELABUHAN -->
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between" style="padding: 20px !important; background: #2366ca">
              <div class="header-title">
                <h4 class="card-title" style="font-weight: bold; color: white">PELABUHAN</h4>
                <small class="text-light" style="font-weight: normal">Memuat informasi tentang pelabuhan</small>
              </div>
              <div>
                <button class="btn btn-sm btn-warning text-light" style="margin-left: auto; height: 70%" type="button" data-bs-toggle="modal" data-bs-target="#modalEditDetailPelabuhanKapal">
                  <i class="ti ti-adjustments-alt"></i>
                </button>
              </div>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table id="basic-table" class="table table-hover mb-0" role="grid">
                  <tbody>
                    <tr>
                      <td style="width: 40%">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/09.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Pelabuhan</h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.harbour) }}</td>
                    </tr>
                    <tr>
                      <td style="border-bottom: none">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/13.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Tanda Selar</h6>
                        </div>
                      </td>
                      <td style="border-bottom: none">{{ formatShipStatus(shipBio.selar_mark) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- LEGALITAS -->
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between" style="padding: 20px !important; background: #2366ca">
              <div class="header-title">
                <h4 class="card-title" style="font-weight: bold; color: white">LEGALITAS</h4>
                <small class="text-light" style="font-weight: normal">Memuat informasi tentang data hukum kapal</small>
              </div>
              <div>
                <button class="btn btn-sm btn-warning text-light" style="margin-left: auto; height: 70%" type="button" data-bs-toggle="modal" data-bs-target="#modalEditDetailLegalitasKapal">
                  <i class="ti ti-adjustments-alt"></i>
                </button>
              </div>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table id="basic-table" class="table table-hover mb-0" role="grid">
                  <tbody>
                    <tr>
                      <td style="width: 40%">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/14.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Nomor SIUP</h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.siup) }}</td>
                    </tr>
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/15.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Nomor BKP</h6>
                        </div>
                      </td>
                      <td>{{ formatShipStatus(shipBio.bkp) }}</td>
                    </tr>
                    <tr>
                      <td style="border-bottom: none">
                        <div class="d-flex align-items-center">
                          <img class="rounded img-fluid avatar-40 me-3 bg-soft-primary p-1" src="@/assets/images/shapes/16.png" style="border: 2px solid #2366ca" alt="profile" loading="lazy" />
                          <h6 style="font-weight: bold; text-transform: uppercase">Terdaftar</h6>
                        </div>
                      </td>
                      <td style="border-bottom: none">{{ formatShipStatus(ship.created_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- -->
    <div class="col-lg-6 col-md-6 col-12">
      <div class="row p-0">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between bg-info" style="padding: 20px !important">
              <div class="header-title">
                <h4 class="card-title" style="font-weight: bold; color: white">HISTORI LABUH KAPAL LAWD ⛵</h4>
                <small class="text-light" style="font-weight: normal">Catatan aktivitas labuh kapal di pelabuhan dan status terkait</small>
              </div>
            </div>

            <!-- HISTORY LABUH -->
            <div class="card-body p-5 scrollbar" style="max-height: 798px !important; overflow-y: auto" v-if="this.dockLogs && this.dockLogs.length > 0">
              <div class="iq-timeline0 m-0 d-flex align-items-center justify-content-between position-relative">
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
            </div>
            <div class="card-body p-5 text-center" style="border-radius: 0px 0px 10px 10px; background: #00000054" v-else>
              <span style="font-weight: bold; font-size: 15px; color: white">BELUM ADA HISTORI </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalEditSpesifikasiKapal :onUpdateComplete="getShipDetail" />
  <ModalEditPelabuhanKapal :onUpdateComplete="getShipDetail" />
  <ModalEditLegalitasKapal :onUpdateComplete="getShipDetail" />
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted, ref } from "vue"

import MapDetail from "@/components/map/MapShipDetail.vue"
import ModalEditSpesifikasiKapal from "@/components/modal/EditDetailSpesifikasiKapal.vue"
import ModalEditPelabuhanKapal from "@/components/modal/EditDetailPelabuhanKapal.vue"
import ModalEditLegalitasKapal from "@/components/modal/EditDetailLegalitasKapal.vue"

export default {
  name: "detailKapal",

  components: {
    MapDetail,
    ModalEditSpesifikasiKapal,
    ModalEditPelabuhanKapal,
    ModalEditLegalitasKapal
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
      shipOnGround: null,

      dockLogInterval: null,
      locationLogInterval: null
    }
  },

  created() {
    const shipDetailId = this.$route.params.shipId
    this.getShipDetail(shipDetailId)
    this.getDockLogs(shipDetailId)
    this.getLocationLogs(shipDetailId)
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

          console.log("💚 GET SHIP DETAIL__ :", shipDetailId, this.ship)

          // console.log("asd", this.shipCurLat, this.shipCurLong)
        })
        .catch((error) => {
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
          // Check if docking_logs is not null and is an array
          if (Array.isArray(res.data.data.docking_logs)) {
            this.dockLogs = res.data.data.docking_logs.map((log) => {
              const date = new Date(log.created_at)
              const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

              const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

              return {
                ...log,
                formattedDate: formattedDate
              }
            })
          } else {
            // If docking_logs is null or not an array, assign it to an empty array
            this.dockLogs = []
            console.warn("No docking logs found.")
          }

          const timestamp = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          console.log(`💚 GET DOCK LOGS__ @ ${timestamp}`)
        })
        .catch((error) => {
          console.error("💥 DOCK LOGS GAGAL UPDATE :", error)
        })
    },

    async getLocationLogs(shipDetailId) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get(`/api/v1/ship/location-log/${shipDetailId}`, config)
        .then((res) => {
          this.locationLogs = res.data.data.location_logs

          const timestamp = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          console.log(`💚 GET LOCATION LOGS__ @ ${timestamp}`)
        })
        .catch((error) => {
          console.error("💥 LOCATION LOGS GAGAL UPDATE :", error)
        })
    },

    // EDIT
    async editShipName(shipName) {
      const { value: newShipName } = await Swal.fire({
        title: "Edit Nama Kapal",
        input: "text",
        inputLabel: "Masukkan Nama Kapal Baru",
        inputValue: shipName,
        inputAttributes: {
          disabled: true
        },
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        inputValidator: (value) => {
          if (!value) {
            return "Nama kapal tidak boleh kosong!"
          }
        }
      })

      if (newShipName) {
        const dataToUpdate = {
          ship_id: this.ship.id,
          type: this.ship.detail.type,
          dimension: this.ship.detail.dimension,
          harbour: this.ship.detail.harbour,
          siup: this.ship.detail.siup,
          bkp: this.ship.detail.bkp,
          selar_mark: this.ship.detail.selar_mark,
          gt: this.ship.detail.gt,
          owner_name: this.ship.detail.owner_name,
          iot_phone: this.ship.detail.iot_phone
        }

        const url = `/api/v1/ship/update-detail`

        try {
          const res = await axios.put(url, dataToUpdate, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: `Nama kapal telah diperbarui menjadi ${newShipName}`
            })

            await this.getShipDetail(this.ship.id) // Call to refresh data
          }
        } catch (error) {
          console.error("Error updating ship details:", error)
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: "Gagal memperbarui nama kapal."
          })
        }
      }
    },

    async editShipOwner(shipOwner) {
      const { value: newShipOwner } = await Swal.fire({
        title: "Edit Pemilik Kapal",
        input: "text",
        inputLabel: "Masukkan Nama Pemilik Baru",
        inputValue: shipOwner,
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        inputValidator: (value) => {
          if (!value) {
            return "Nama tidak boleh kosong!"
          }
        }
      })

      if (newShipOwner) {
        const dataToUpdate = {
          ship_id: this.ship.id,
          type: this.ship.detail.type,
          dimension: this.ship.detail.dimension,
          harbour: this.ship.detail.harbour,
          siup: this.ship.detail.siup,
          bkp: this.ship.detail.bkp,
          selar_mark: this.ship.detail.selar_mark,
          gt: this.ship.detail.gt,
          owner_name: newShipOwner,
          iot_phone: this.ship.detail.iot_phone
        }

        const url = `/api/v1/ship/update-detail`

        try {
          const res = await axios.put(url, dataToUpdate, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          // Show success message
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: `Nama telah diperbarui menjadi ${newShipOwner}`
            })

            await this.getShipDetail(this.ship.id) // Call to refresh data
          }
        } catch (error) {
          console.error("Error updating ship details:", error)
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: "Gagal memperbarui nama pemilik kapal."
          })
        }
      }
    },

    async editShipResponsible(shipResponsible) {
      const { value: newShipResponsible } = await Swal.fire({
        title: "Edit Pemilik Kapal",
        input: "text",
        inputLabel: "Masukkan Nama Pemilik Baru",
        inputValue: shipResponsible,
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        inputValidator: (value) => {
          if (!value) {
            return "Nama tidak boleh kosong!"
          }
        }
      })

      if (newShipResponsible) {
        const dataToUpdate = {
          ship_id: this.ship.id,
          type: this.ship.detail.type,
          dimension: this.ship.detail.dimension,
          harbour: this.ship.detail.harbour,
          siup: this.ship.detail.siup,
          bkp: this.ship.detail.bkp,
          selar_mark: this.ship.detail.selar_mark,
          gt: this.ship.detail.gt,
          owner_name: this.ship.detail.owner_name,
          iot_phone: this.ship.detail.iot_phone
        }

        const url = `/api/v1/ship/update-detail`

        try {
          const res = await axios.put(url, dataToUpdate, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          })

          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: `Nama telah diperbarui menjadi ${newShipResponsible}`
            })

            await this.getShipDetail(this.ship.id)
          }
        } catch (error) {
          console.error("Error updating ship details:", error)
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: "Gagal memperbarui nama penanggung jawab."
          })
        }
      }
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
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 8px 20px rgba(83, 83, 83, 0.5);
  background: rgb(35 102 202 / 40%);
  color: white;
}

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
