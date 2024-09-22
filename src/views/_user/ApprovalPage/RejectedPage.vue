<template>
  <b-row class="p-4">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-secondary pb-3">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">PENGAJUAN <span style="color: #ff2424">DITOLAK</span></h4>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                <button type="button" id="kapal_detail" class="btn btn-sm btn-warning" style="display: inline-block" @click="downloadCSV"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button>
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Kapal / Penanggung Jawab / Device ID / No HP)" v-model="searchQuery" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="basic-table" class="table table-border mb-0" role="grid">
              <thead>
                <tr class="text-white" style="background: #000f25e0; border-top: 1px solid white">
                  <th scope="col" style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                  <th scope="col" style="font-weight: bolder">NAMA KAPAL</th>
                  <th scope="col" style="font-weight: bolder">PENANGGUNG JAWAB</th>
                  <th scope="col" class="text-center" style="font-weight: bolder">PENGAJUAN</th>
                  <th scope="col" class="text-center" style="font-weight: bolder; width: 5%">NOMOR HP</th>
                </tr>
              </thead>
              <tbody style="background: white">
                <!-- Check if pendingList has data -->
                <tr v-if="!filteredRejectedData || filteredRejectedData.length === 0">
                  <td colspan="6" class="bg-soft-white">Data kosong</td>
                </tr>

                <tr v-for="(item, index) in paginatedApprovedData" :key="index">
                  <td class="text-center bg-soft-light">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder" data-label="🚢">
                    {{ item.ship_name }}
                  </td>
                  <td data-label="👲">
                    <span style="font-weight: bold; text-transform: uppercase">{{ item.responsible_name }}</span> <br />
                    <small>📱{{ item.device_id }}</small>
                  </td>
                  <td class="text-center">
                    {{ item.created_at }}
                  </td>
                  <td class="text-center bg-soft-light">
                    <a :href="getWhatsAppLink(item.phone)" type="button" class="btn btn-sm btn-info p-2" target="_blank" style="display: flex; gap: 10px; align-items: center">
                      <img src="@/assets/images/icon/whatsapp.png" width="20" height="20" style="display: inline-block; box-shadow: 0 0 5px white; border-radius: 5px" />
                      <span style="display: inline-block; color: white !important">{{ item.phone }}</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="pagination-container p-3 bg-soft-secondary" style="border-radius: 0px 0px 20px 20px">
              <!-- Previous button -->
              <button @click="currentPage -= 1" :disabled="currentPage === 1" class="prev-next-button"><span>&#9665;</span> Previous</button>

              <!-- Numbered page buttons -->
              <button v-for="page in totalPages" :key="page" @click="currentPage = page" :disabled="currentPage === page" :class="{ 'pagination-button': true, active: currentPage === page }">
                {{ page }}
              </button>

              <!-- Next button -->
              <button @click="currentPage += 1" :disabled="currentPage === totalPages" class="prev-next-button">Next <span>&#9655;</span></button>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import AOS from "aos"
import axios from "axios"
import Swal from "sweetalert2"
import { onMounted, ref } from "vue"
import "@/assets/custom-vue/css/pagination.css"

export default {
  name: "RejectedPage",
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
      rejectedList: [],
      searchQuery: "",

      currentPage: 1,
      itemsPerPage: 10
    }
  },

  computed: {
    filteredRejectedData() {
      this.currentPage = 1

      const searchQuery = this.searchQuery.toLowerCase()
      return this.rejectedList.filter((item) => item.status === "rejected" && Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery)))
    },
    paginatedApprovedData() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredRejectedData.slice(startIdx, endIdx)
    },
    totalPages() {
      return Math.ceil(this.filteredRejectedData.length / this.itemsPerPage)
    }
  },

  mounted() {
    console.clear()
    this.fetchShipRejected()
  },

  methods: {
    async fetchShipRejected() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("/api/v1/ship/pairing-request", config)
        .then((response) => {
          this.rejectedList = response.data.data

          console.log("💚 REJECTED FETCHED", this.rejectedList)
        })
        .catch((error) => {
          console.error("💥 REJECTED ERROR :" + error)
        })
    },

    async fetchShipRejectedDetail(deviceId) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      axios
        .get(`/api/v1/ship/pairing/detail/${deviceId}`, config)
        .then((res) => {
          this.shipDetail = res.data.data
          this.historyPairing = res.data.data.history_pairing

          console.clear()
          console.log("💚 SHIP DETAIL FETCHED", this.shipDetail)
        })
        .catch((error) => {
          console.error("💥 SHIP DETAIL ERROR :", error)
          return
        })
    },

    getWhatsAppLink(phoneNumber) {
      phoneNumber = phoneNumber.replace(/[-\s]/g, "")

      if (phoneNumber.startsWith("0")) {
        phoneNumber = "+62" + phoneNumber.slice(1)
      }

      return `https://wa.me/${phoneNumber}?text=`
    },

    formatDate(date) {
      const options = { day: "numeric", month: "numeric", year: "numeric" }
      return new Date(date).toLocaleDateString("en-GB", options)
    },

    downloadCSV() {
      const filteredRejectedData = this.filteredRejectedData

      if (filteredRejectedData.length === 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
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
          title: "DATA KOSONG"
        })
        return
      }

      const currentDate = new Date()
      const formattedDate = this.formatDate(currentDate)

      const header = Object.keys(filteredRejectedData[0]).join(",")
      const rows = filteredRejectedData.map((ship) => Object.values(ship).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `PENGAJUAN_DITOLAK_${formattedDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error("💥 EXPORT FAILED, BROWSER DOESNT SUPPORT BLOB/DOWNLOAD:")

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer
            toast.onmouseleave = Swal.resumeTimer
          }
        })
        Toast.fire({
          icon: "error",
          title: "GAGAL",
          text: "Browser Tidak Support BLOB/Download ! 😊"
        })
      }
    }
  }
}
</script>
