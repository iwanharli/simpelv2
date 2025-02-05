<template>
  <b-row class="p-4">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-left" data-aos-delay="100">
        <b-card-header class="bg-secondary pb-3">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">KEDATANGAN KAPAL</h4>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                <select class="form-select-sm" v-model="rowsPerPage" @change="fetchData" :style="{ width: '70px' }">
                  <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <!-- <button style="display: inline-block" class="btn btn-secondary text-white" type="button" id="kapal_detail" @click="downloadCSV"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button> -->
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Nama Kapal) - tekan enter" v-model="searchQuery" @keyup.enter="fetchShipArrival" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="basic-table" class="table table-border mb-0" role="grid">
              <thead>
                <tr class="text-white" style="background: #000f25e0; border-top: 1px solid white">
                  <th style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                  <th style="font-weight: bolder">NAMA KAPAL</th>
                  <th style="font-weight: bolder">LATITUDE</th>
                  <th style="font-weight: bolder">LONGITUDE</th>
                  <th style="font-weight: bolder" class="text-center">WAKTU CHECKIN</th>
                  <th style="width: 5%"></th>
                </tr>
              </thead>
              <tbody style="background: white">
                <!-- Check if pendingList has data -->
                <tr v-if="paginatedShips.length === 0">
                  <td colspan="6" class="bg-soft-white">Data kosong</td>
                </tr>

                <tr v-for="(item, index) in paginatedShips" :key="index" data-aos="fade-left" :data-aos-delay="100 * (index + 2)" v-else>
                  <td class="text-center bg-soft-light p-2">
                    {{ index }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.ship_name }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.lat }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.long }}
                  </td>
                  <td class="text-center">
                    {{ item.checkin_date }}
                  </td>
                  <td class="text-center bg-soft-primary">
                    <b-button size="sm" variant="success" @click="inspectedSubmit(item.log_id)" :disabled="item.is_inspected === 1"> <i class="ti ti-checks me-xs-1"></i> &nbsp; INSPEKSI </b-button>
                    &nbsp;
                    <b-button size="sm" variant="warning" @click="reportedSubmit(item.log_id)" :disabled="item.is_reported === 1"> <i class="ti ti-ban me-xs-1"></i> &nbsp; REPORT </b-button>
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

  <test />
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
      shipArrival: [],

      currentPage: 1,
      rowsPerPage: 10,
      rowsOptions: [10, 15, 50, "ALL"],
      searchQuery: ""
    }
  },

  computed: {
    paginatedShips() {
      // Return an empty array if shipArrival is not available
      if (!this.shipArrival) {
        return []
      }

      if (this.rowsPerPage === "ALL") {
        return this.shipArrival
      }

      const start = (this.currentPage - 1) * this.rowsPerPage
      const end = start + this.rowsPerPage

      return this.shipArrival.slice(start, end)
    },

    totalPages() {
      if (!this.shipArrival) {
        return 1
      }
      if (this.rowsPerPage === "ALL") {
        return 1
      }
      return Math.ceil(this.shipArrival.length / this.rowsPerPage)
    }
  },

  created() {
    this.fetchShipArrival()
  },

  methods: {
    async fetchShipArrival() {
      console.log("Fetching Ship Arrival...") // Log to check when it's called

      const config = {
        params: {
          search: this.searchQuery
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }

      try {
        const res = await axios.get("/api/v1/inspection/", config)
        this.shipArrival = res.data.data
        this.currentPage = 1 // Reset to the first page when data is fetched

        console.log("💚 SHIP ARRIVAL FETCHED", this.shipArrival)
      } catch (error) {
        console.error("💥 SHIP ARRIVAL ERROR:", error)
      }
    },

    inspectedSubmit(id) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        is_inspected: true
      }

      axios
        .put(`/api/v1/inspection/update-checkup/${id}`, updatedData, config)
        .then((response) => {
          console.log("💚 INSPEKSI SUCCESS", updatedData)

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
            icon: "success",
            title: "Berhasil INSPEKSI"
          })

          this.fetchShipArrival()
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "GAGAL",
            text: "KAPAL SUDAH DI-INSPEKSI!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          })
        })

      console.log(id, updatedData)
    },

    reportedSubmit(id) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        is_reported: true
      }

      axios
        .put(`/api/v1/inspection/update-checkup/${id}`, updatedData, config)
        .then((response) => {
          console.log("💚 REPORT SUCCESS", updatedData)

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
            icon: "success",
            title: "Berhasil REPORT"
          })

          this.fetchShipArrival()
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "GAGAL",
            text: "KAPAL SUDAH DI-REPORT!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          })
        })

      console.log(id, updatedData)
    },

    // PAGINATION
    updatePagination() {
      this.currentPage = 1
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    goToPage(pageNumber) {
      this.currentPage = pageNumber
    }
  },

  watch: {
    rowsPerPage() {
      this.updatePagination()
    }
  }
}
</script>
