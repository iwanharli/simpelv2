<template>
  <b-row class="p-5" style="min-height: 91vh">
    <b-col xl="12" class="bg-transparent">
      <div class="card bg-soft-secondary" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-primary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="9" lg="9" md="9" sm="9">
                <h4 style="font-weight: bold; color: white">SETTING APLIKASI &nbsp;<small style="font-weight: lighter;">*(untuk android)</small></h4>
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-5 bg-light">
          <div class="row">
            <div class="col-md-6 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">KODE PELABUHAN</label>
              <input type="text" class="form-control" v-model="harbourCode" required="" style="border-color: white" />
            </div>
            <div class="col-md-6 mb-5">
              <label class="form-label text-black" style="font-weight: bolder">NAMA PELABUHAN</label>
              <input type="text" class="form-control" v-model="harbourName" required="" style="border-color: white" />
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
              <button class="btn btn-primary p-2" type="submit" style="width: 100%" @click="updateMobileSetting">SIMPAN PERUBAHAN</button>
            </div>
            <div class="col-md-4">
              <button class="btn btn-warning p-2" type="submit" style="width: 100%" @click="resetSetting">RESET</button>
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
      appMode: "",
      appInterval: "",
      appRange: "",
      appVersion: "",
      appUrl: "",
      appGeofence: []
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
          this.appMode = appSetting.mode
          this.appInterval = appSetting.interval
          this.appRange = appSetting.range
          this.appVersion = appSetting.apk_min_version
          this.appUrl = appSetting.apk_min_download

          this.appGeofence = appSetting.geofences

          console.log("💚 SETTING FETCHED", appSetting)
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
        apk_min_version: this.appVersion,
        interval: parseInt(this.appInterval),
        range: parseInt(this.appRange),
        apk_download_link: this.appUrl,
        geofence: []
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
          console.log("🚀 UPDATE SUCCESS", response)
        })
        .catch((error) => {
          console.error("💥 UPDATE FAILED:", error)
        })
    },

    async resetSetting() {
      // INITIAL
      this.harbourCode = 919191
      this.harbourName = "PELABUHAN TEGALSARI"
      this.appMode = "interval"
      this.appInterval = 30
      this.appRange = 2
      this.appVersion = "2.5.0"
      this.appUrl = "https://demo.t-hisyam.net/apk/simpel/app-release.apk"
      const coordinate = []

      // UPDATING
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        harbour_code: parseInt(this.harbourCode),
        harbour_name: this.harbourName,
        mode: this.appMode,
        apk_min_version: this.appVersion,
        interval: parseInt(this.appInterval),
        range: parseInt(this.appRange),
        apk_download_link: this.appUrl,
        geofence: coordinate
      }

      //   console.log(updatedData)

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
