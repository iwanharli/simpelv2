<template>
  <b-row class="p-5">
    <b-col xl="12" class="bg-transparent">
      <div class="card bg-soft-light" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-primary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="9" lg="8" md="7" sm="7">
                <h4 style="font-weight: bold; color: white">HISTORY LABUH KAPAL</h4>
              </b-col>
              <b-col xl="3" lg="4" md="5" sm="5" class="d-flex justify-content-end custom-export">
                <button style="display: inline-block" class="btn btn-secondary" type="button" data-bs-toggle="modal" data-bs-target="#modalDownload" @click="uniqueShipNames"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button>
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Nama Kapal)" v-model="searchDockingQuery" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="basic-table table-border" class="table table-md mb-0" role="grid">
              <thead>
                <tr class="bg-soft-primary">
                  <th style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                  <th style="font-weight: bolder">NAMA KAPAL</th>
                  <th style="font-weight: bolder; width: 10%" class="text-center">STATUS</th>
                  <th style="font-weight: bolder; width: 16%">LATITUDE</th>
                  <th style="font-weight: bolder; width: 16%">LONGITUDE</th>
                  <th style="font-weight: bolder; width: 16%" class="text-center">WAKTU LOG</th>
                  <th style="width: 5%"></th>
                </tr>
              </thead>
              <tbody>
                <!-- Check if pendingList has data -->
                <tr v-if="!filteredDockingReports || filteredDockingReports.length === 0">
                  <td colspan="6" class="bg-soft-white">Data kosong</td>
                </tr>

                <tr v-for="(item, index) in paginatedDockingReports" :key="index" v-else>
                  <td class="text-center bg-soft-light">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.ship_name }}
                  </td>
                  <td class="text-center" style="text-transform: uppercase; padding-left: 25px !important">
                    <div class="badge bg-primary pt-2 pb-2" v-if="item.status === 'checkin'" style="width: 100%">
                      <span>{{ item.status }}</span>
                    </div>
                    <div class="badge bg-info pt-2 pb-2" v-else-if="item.status === 'checkout'" style="width: 100%">
                      <span>{{ item.status }}</span>
                    </div>
                    <div class="badge bg-warning pt-1 pb-1" v-else-if="item.status === 'out of scope'" style="width: 100%">
                      <span>{{ item.status }}</span>
                    </div>
                  </td>
                  <td>
                    {{ item.lat }}
                  </td>
                  <td>
                    {{ item.long }}
                  </td>
                  <td class="text-center">
                    {{ item.log_date }}
                  </td>
                  <td class="text-center bg-soft-primary">
                    <RouterLink :to="{ name: 'admin.shipDetail', params: { shipId: item.ship_id } }">
                      <button class="btn btn-sm btn-primary" type="button" id="kapal_detail"><i class="ti ti-search me-sm-1"></i> DETAIL</button>
                    </RouterLink>
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

  <div class="modal fade" id="modalDownload" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">Export CSV</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body mb-3" style="height: 500px !important">
          <div class="col-12 mb-3">
            <label class="form-label" style="font-weight: bolder">PILIH KAPAL </label>(kosongi jika memilih semua)
            <div>
              <VueMultiselect v-model="selectedShip" :options="this.options" :multiple="true" :clear-on-select="true" placeholder="Pilih Kapal"> </VueMultiselect>
            </div>
          </div>
          <div class="row mt-4">
            <label class="form-label" style="font-weight: bolder">TANGGAL</label>
            <div class="col-6">
              <input type="date" class="form-control" v-model="inputDateStart" required="" />
            </div>
            <div class="col-6">
              <input type="date" class="form-control" v-model="inputDateEnd" required="" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="validationDownload()">Download</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted, ref } from "vue"
import VueMultiselect from "vue-multiselect"
import "@/assets/custom-vue/css/pagination.css"

export default {
  name: "DockingPage",
  components: { VueMultiselect },
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
      dockingReports: [],
      searchDockingQuery: "",

      selectedShip: "",
      inputDateStart: "",
      inputDateEnd: "",

      currentPage: 1,
      itemsPerPage: 10,
      selected: null,
      options: ["Singa", "Gajah"]
    }
  },

  computed: {
    filteredDockingReports() {
      this.currentPage = 1
      const searchQuery = this.searchDockingQuery.toLowerCase().trim()

      if (this.dockingReports) {
        return this.dockingReports.filter((report) => report.ship_name.toLowerCase().includes(searchQuery))
      } else {
        console.error("💥 dockingReports is null or undefined")
        return [] // or any default value you prefer when this.dockingReports is null or undefined
      }
    },

    paginatedDockingReports() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredDockingReports.slice(startIdx, endIdx)
    },

    totalPages() {
      return Math.ceil(this.filteredDockingReports.length / this.itemsPerPage)
    },

    uniqueShipNames() {
      const uniqueNames = [...new Set(this.dockingReports.map((report) => report.ship_name))]

      this.options = uniqueNames

      // return uniqueNames.map((name) => ({ name }))
    }
  },

  mounted() {
    this.getShipDocking()
  },

  methods: {
    async getShipDocking() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("/api/v1/report/ship-docking", config)
        .then((res) => {
          this.dockingReports = res.data.data

          // console.clear()
          console.log("💚 LOG DOCKING FETCHED", this.dockingReports)
        })
        .catch((error) => {
          console.error("💥 LOG DOCKING ERROR :", error)
        })
    },

    validationDownload() {
      // console.log(this.selectedShip)
      if (!this.inputDateStart) {
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
          icon: "error",
          title: "SILAHKAN ISI RENTANG TANGGAL"
        })
        return
      }

      if (!this.inputDateEnd) {
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
          icon: "error",
          title: "SILAHKAN ISI RENTANG TANGGAL"
        })
        return
      }

      this.checkDockingData()
    },

    checkDockingData() {
      console.log("📅", this.inputDateStart, "-", this.inputDateEnd)
      console.log("🐊", this.selectedShip)

      // Convert this.selectedShip to an array of ship names
      const selectedShipsArray = Object.values(this.selectedShip)

      // Filter by ship names
      let filteredReports = this.dockingReports
      if (selectedShipsArray.length > 0) {
        filteredReports = filteredReports.filter((report) => {
          return selectedShipsArray.includes(report.ship_name)
        })
      }

      // Filter by date range
      filteredReports = filteredReports.filter((report) => {
        const reportDate = new Date(report.log_date)
        return reportDate >= new Date(this.inputDateStart) && reportDate <= new Date(this.inputDateEnd)
      })

      console.log("↪️", filteredReports)

      // Filter by date range
      filteredReports = filteredReports.filter((report) => {
        const reportDate = new Date(report.log_date)
        return reportDate >= new Date(this.inputDateStart) && reportDate <= new Date(this.inputDateEnd)
      })

      console.log("↪️", filteredReports)

      // Check if filteredReports is null or empty
      if (!filteredReports || filteredReports.length === 0) {
        console.error("💥 EXPORT FAILED, DATA NULL")

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
          icon: "warning",
          title: "GAGAL",
          text: "DATA KOSONG ! 😊"
        })
        ;(this.selectedShip = ""), (this.inputDateStart = ""), (this.inputDateEnd = "")

        return
      }

      const header = Object.keys(filteredReports[0]).join(",")
      const rows = filteredReports.map((report) => Object.values(report).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      const currentDate = new Date()
      const formattedDate = this.formatDate(currentDate)

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `LOG_LABUH_${formattedDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error("💥 EXPORT FAILED, BROWSER DOESNT SUPPORT BLOB/DOWNLOAD:")

        const Toast = Swal.mixin({
          toast: true,
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
    },

    formatDate(date) {
      const options = { day: "numeric", month: "numeric", year: "numeric" }
      return new Date(date).toLocaleDateString("en-GB", options)
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.multiselect {
  box-sizing: inherit !important;
  border: 0 !important;
  padding: 0 !important;
}

.multiselect .multiselect__content-wrapper {
  max-height: 400px !important;
}

.pagination-button:hover {
  background-color: #2196f3;
  color: white;
}

.prev-next-button {
  border: 2px solid #3a57e8; /* Blue border color */
  background-color: #3a57e8; /* Blue background color */
  color: white;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.prev-next-button:hover {
  background-color: #1565c0; /* Darker blue on hover */
  border-color: #1565c0; /* Darker blue border on hover */
}
</style>
