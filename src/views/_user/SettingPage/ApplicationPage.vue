<template>
  <b-row class="p-4" style="min-height: 91vh">
    <!-- SETTING APLIKASI  -->
    <b-col xl="9" class="bg-transparent" data-aos="fade-right" data-aos-delay="100">
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
        <div class="card-body p-5 bg-light" style="border-radius: 0px 0px 20px 20px; border: 5px solid #001f4d">
          <div class="row">
            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">KODE PELABUHAN</label>
              <input type="text" class="form-control" v-model="harbourCode" required="" style="border-color: white" />
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">NAMA PELABUHAN</label>
              <input type="text" class="form-control" v-model="harbourName" required="" style="border-color: white" />
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">KONTAK ADMIN</label>
              <input type="text" class="form-control" v-model="adminContact" required="" style="border-color: white" />
            </div>

            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">MODE</label>
              <select class="form-select" v-model="appMode" required="">
                <option value="interval">Interval</option>
                <option value="jarak">Jarak</option>
              </select>
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">INTERVAL</label>
              <input type="number" class="form-control" placeholder="30" v-model="appInterval" required="" style="border-color: white" />
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">JARAK</label>
              <input type="number" class="form-control" placeholder="30" v-model="appRange" required="" style="border-color: white" />
            </div>

            <div class="col-md-8">
              <button class="btn btn-primary p-2 mt-2" type="submit" style="width: 100%" @click="updateMobileSetting">SIMPAN PERUBAHAN</button>
            </div>
            <div class="col-md-4">
              <button class="btn btn-warning p-2 mt-2" type="submit" style="width: 100%" @click="resetSetting">RESET</button>
            </div>
          </div>
        </div>
      </div>
    </b-col>

    <!-- SETTING BIAYA  -->
    <b-col xl="3">
      <div class="card bg-light" data-aos="fade-down" data-aos-delay="110" style="border-radius: 0px 0px 20px 20px">
        <b-card-header class="bg-secondary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="9" lg="9" md="9" sm="9">
                <h4 style="font-weight: bold; color: white">BIAYA LABUH</h4>
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-5 bg-light" style="border-radius: 0px 0px 20px 20px; border: 5px solid #001f4d">
          <div class="row">
            <div class="col-md-12 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">BIAYA LABUH</label>
              <input type="text" class="form-control" placeholder="30.000" v-model="formattedDockingCost" @input="formatDockingCost" required style="border-color: white; background: #edff0033" />
            </div>
            <div class="col-md-12 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">MULTIPLIER BIAYA</label>
              <input type="number" class="form-control" placeholder="30" v-model="costMultiplier" required="" style="border-color: white; background: #edff0033" />
            </div>

            <div class="col-12">
              <button class="btn btn-secondary p-2 mt-2" type="submit" style="width: 100%" @click="updateMobileSetting">SIMPAN PERUBAHAN</button>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
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
      harbourCode: "",
      harbourName: "",
      adminContact: "",
      appMode: "",
      appInterval: "",
      appRange: "",
      appVersion: "",
      appUrl: "",
      dockingCost: 0,
      costMultiplier: 0,
      appGeofence: []
    }
  },

  computed: {
    formattedDockingCost: {
      get() {
        return this.dockingCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      set(value) {
        this.dockingCost = parseInt(value.replace(/\./g, ""), 10) || 0
      }
    }
  },

  mounted() {
    this.getSettingApp()
  },

  methods: {
    async getSettingApp() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("api/v1/setting/web", config)
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

          console.log("💚 SETTING FETCHED", appSetting)
        })
        .catch((error) => {
          console.log("💥 GET SETTING FAILED")

          setTimeout(this.getSettingApp, 1000)
        })
    },

    async updateMobileSetting() {
      if (parseInt(this.dockingCost) === 0) {
        Swal.fire({
          title: "Invalid Input",
          text: "BIAYA LABUH tidak boleh 0",
          icon: "error",
          confirmButtonText: "OK"
        })
        return
      }

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
        cost_multiplier: parseInt(this.costMultiplier),
        apk_download_link: this.appUrl,
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
