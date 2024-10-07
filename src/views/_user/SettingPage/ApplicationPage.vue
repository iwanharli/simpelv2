<template>
  <b-row class="p-4">
    <!-- SETTING APLIKASI  -->
    <b-col xl="8" class="bg-transparent" data-aos="fade-right" data-aos-delay="100">
      <div class="card bg-light" style="border-radius: 0px 0px 20px 20px">
        <b-card-header class="bg-secondary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="9" lg="9" md="9" sm="9">
                <h4 style="font-weight: bold; color: white">
                  SETTING APLIKASI &nbsp;
                  <span style="font-weight: lighter; font-size: 15px">*(untuk android)</span>
                </h4>
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-5 pb-2 bg-light" style="border-radius: 0px 0px 0px 0px; border: 5px solid #001f4d; border-bottom: none;">
          <div class="row">
            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">KODE PELABUHAN</label>
              <input type="text" class="form-control" v-model="appSetting.harbour_code" required="" style="border-color: white" />
            </div>
            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">NAMA PELABUHAN</label>
              <input type="text" class="form-control" v-model="appSetting.harbour_name" required="" style="border-color: white" />
            </div>
            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">KONTAK ADMIN</label>
              <input type="text" class="form-control" v-model="appSetting.admin_contact" required="" style="border-color: white" />
            </div>

            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">MODE</label>
              <select class="form-select" v-model="appSetting.mode" required="">
                <option value="interval">Interval</option>
                <option value="jarak">Jarak</option>
              </select>
            </div>
            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">INTERVAL</label>
              <input type="number" class="form-control" placeholder="30" v-model="appSetting.interval" required="" style="border-color: white" />
            </div>
            <div class="col-md-6 mb-4">
              <label class="form-label text-black" style="font-weight: bolder">JARAK</label>
              <input type="number" class="form-control" placeholder="30" v-model="appSetting.range" required="" style="border-color: white" />
            </div>
          </div>
        </div>
        <div class="card-body bg-secondary" style="border-radius: 0px 0px 20px 20px; padding: 20px 50px 20px 50px">
          <div class="row d-flex justify-content-between">
            <div class="col-md-6">
              <button class="btn btn-primary p-2 mt-2 mb-2" type="submit" style="width: 100%; border: 2px solid white" @click="updateMobileSetting">SIMPAN PERUBAHAN</button>
            </div>
            <div class="col-md-4">
              <button class="btn btn-warning p-2 mt-2 mb-2" type="submit" style="width: 100%; border: 2px solid white" @click="resetSetting">RESET</button>
            </div>
          </div>
        </div>
      </div>
    </b-col>

    <b-col xl="4" class="bg-transparent" data-aos="fade-left" data-aos-delay="100">
      <div class="card bg-white" style="border-radius: 20px">
        <b-card-header class="bg-warning text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="9" lg="9" md="9" sm="9">
                <h4 style="font-weight: bold; color: white">NOTES*</h4>
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <b-card-body style="background: #ffff0061; border: 5px solid #f16a1b; border-top: none; border-radius: 0px 0px 20px 20px; padding: 20px">
          <ul style="list-style-type: none; padding: 0">
            <li style="margin-bottom: 15px">
              <div class="note-item"><strong style="color: #333">Kode Pelabuhan:</strong> <span>Input untuk kode pelabuhan.</span></div>
            </li>
            <li style="margin-bottom: 15px">
              <div class="note-item"><strong style="color: #333">Nama Pelabuhan:</strong> <span>Input untuk nama pelabuhan.</span></div>
            </li>
            <li style="margin-bottom: 15px">
              <div class="note-item"><strong style="color: #333">Kontak Admin:</strong> <span>Input untuk kontak admin.</span></div>
            </li>
            <li style="margin-bottom: 15px">
              <div class="note-item"><strong style="color: #333">Mode:</strong> <span>Dropdown untuk memilih antara interval atau jarak.</span></div>
            </li>
            <li style="margin-bottom: 15px">
              <div class="note-item"><strong style="color: #333">Waktu Interval:</strong> <span>Input untuk memasukkan waktu interval dalam detik.</span></div>
            </li>
            <li>
              <div class="note-item"><strong style="color: #333">Jarak:</strong> <span>Input untuk memasukkan jarak dalam meter.</span></div>
            </li>
          </ul>
        </b-card-body>
      </div>
    </b-col>
  </b-row>

  <!-- MODAL  -->
  <!-- <div class="modal fade" id="modalEditZone" :v-model="showModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row p-2 mt-2">
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01" style="font-weight: bolder">DOCKING COST</label>
              <input type="text" class="form-control" id="deviceId" v-model="zone.docking_cost" required />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01" style="font-weight: bolder">COST MULTIPLIER</label>
              <input type="text" class="form-control" id="shipName" v-model="zone.cnost_multiplier" required />
            </div>
          </div>
        </div>
        <div class="modal-footer mt-4">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="validationAddShip()">Tambah</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Batal</button>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted, ref } from "vue"

export default {
  name: "SettingPage",
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
      appSetting: {
        zone: []
      }
    }
  },

  // computed: {
  //   formattedDockingCost: {
  //     get() {
  //       return this.dockingCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  //     },
  //     set(value) {
  //       this.dockingCost = parseInt(value.replace(/\./g, ""), 10) || 0
  //     }
  //   }
  // },

  mounted() {
    this.getSettingApp()
  },

  methods: {
    async getSettingApp() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("api/v1/setting/web", config)
        .then((res) => {
          this.appSetting = res.data.data

          console.log("💚 SETTING FETCHED", this.appSetting)
        })
        .catch((error) => {
          console.log("💥 GET SETTING FAILED")
          setTimeout(this.getSettingApp, 1000)
        })
    },

    async updateMobileSetting() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      const updatedData = {
        harbour_code: parseInt(this.harbourCode),
        harbour_name: this.harbourName,
        mode: this.appMode,
        interval: parseInt(this.appInterval),
        range: parseInt(this.appRange),
        docking_cost: parseInt(this.dockingCost),
        cost_multiplier: parseInt(this.costMultiplier),
        admin_contact: this.adminContact,
        geofence: this.appGeofence
      }

      await axios
        .post("api/v1/setting/create-or-update", updatedData, config)
        .then((response) => {
          Swal.fire({
            title: "Terimakasih!",
            text: "Setting telah berhasil diupdate 😊",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          })

          this.getSettingApp()
          console.log("🚀 UPDATE SUCCESS")
        })
        .catch((error) => {
          console.error("💥 UPDATE FAILED:", error)
        })
    },

    async resetSetting() {
      // Show SweetAlert confirmation before resetting
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan mengatur ulang semua pengaturan ke default!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Reset",
        cancelButtonText: "Batal",
        reverseButtons: true
      })

      if (result.isConfirmed) {
        // INITIAL
        this.harbourCode = 919191
        this.harbourName = "PELABUHAN NIZAM ZACHMAN"
        this.adminContact = "081802796414"
        this.appMode = "interval"
        this.appInterval = 30
        this.appRange = 2
        this.appVersion = "2.5.0"
        this.appUrl = "https://demo.t-hisyam.net/apk/simpel/app-release.apk"
        this.dockingCost = 20000
        this.costMultiplier = 1
        const coordinate = this.appGeofence

        // RESETING
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

        // console.log(updatedData)

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

            this.getSettingApp()
            console.log("🚀 RESET SUCCESS")
          })
          .catch((error) => {
            console.error("💥 RESET FAILED:", error)
          })
      } else {
        console.log("Reset canceled by user")
      }
    },

    formatDockingCost(event) {
      const value = event.target.value.replace(/\./g, "") // remove any existing dots
      this.dockingCost = parseInt(value, 10) || 0
    }
  }
}
</script>
