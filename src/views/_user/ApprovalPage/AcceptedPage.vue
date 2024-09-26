<template>
  <b-row style="padding-left: 30px; padding-right: 20px; padding-top: 30px; position: relative; top: 80px">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-left" data-aos-delay="110">
        <b-card-header class="bg-secondary pb-3">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">PENGAJUAN <span style="color: #55ff2d">DISETUJUI</span></h4>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                <select class="form-select-sm" v-model="itemsPerPage" @change="updatePagination" :style="{ width: '70px' }">
                  <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <button type="button" id="kapal_detail" class="btn btn-sm btn-warning" style="display: inline-block; margin-left: 10px" @click="downloadCSV"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button>
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Kapal / Penanggung Jawab / Device ID / No HP)" v-model="searchQuery" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="basic-table table-border" class="table table-hover mb-0" role="grid">
              <thead>
                <tr class="text-white" style="background: #000f25e0; border-top: 1px solid white">
                  <th scope="col" class="text-center" style="font-weight: bolder; width: 5px">ID</th>
                  <th scope="col" style="font-weight: bolder">NAMA KAPAL</th>
                  <th scope="col" style="font-weight: bolder">PENANGGUNG JAWAB</th>
                  <th scope="col" class="text-center" style="font-weight: bolder; width: 5%">NOMOR HP</th>
                  <!-- <th scope="col" class="text-center" style="font-weight: bolder">TERDAFTAR</th> -->
                  <th scope="col" style="width: 5%"></th>
                </tr>
              </thead>
              <tbody style="background: white">
                <!-- Check if pendingList has data -->
                <tr v-if="!filteredApprovedData || filteredApprovedData.length === 0">
                  <td colspan="6" class="bg-soft-white">Data kosong</td>
                </tr>

                <tr v-for="(item, index) in paginatedApprovedData" :key="index" v-else>
                  <td class="text-center bg-soft-light" style="font-weight: bolder">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder" data-label="🚢">
                    {{ item.ship_name }}
                  </td>
                  <td data-label="👲">
                    <span style="font-weight: bold; text-transform: uppercase">{{ item.responsible_name }}</span> <br />
                    <small>📱{{ item.device_id }}</small>
                  </td>
                  <td data-label="📱">
                    <a :href="getWhatsAppLink(item.phone)" type="button" class="btn btn-sm btn-info p-2" target="_blank" style="display: flex; gap: 10px; align-items: center">
                      <img src="@/assets/images/icon/whatsapp.png" width="20" height="20" style="display: inline-block; box-shadow: 0 0 5px white; border-radius: 5px" />
                      <span style="display: inline-block; color: white !important">{{ item.phone }}</span>
                    </a>
                  </td>
                  <!-- <td class="text-center">
                    {{ item.created_at }}
                  </td> -->
                  <td class="text-center bg-soft-primary">
                    <button class="btn btn-sm btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalViewDetailApproved" @click="fetchShipAcceptedDetail(item.username)"><i class="ti ti-search me-sm-1"></i> DETAIL</button>
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

  <div class="modal fade" id="modalViewDetailApproved" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">DETAIL APPROVAL</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-border" v-if="shipDetail">
            <tbody>
              <tr>
                <th class="text-dark" style="font-weight: bolder">KAPAL</th>
                <td>{{ shipDetail.ship_name }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">PENANGGUNG JAWAB</th>
                <td>{{ shipDetail.responsible_name }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">NOMOR HP</th>
                <td>{{ shipDetail.phone }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">DEVICE ID</th>
                <td>{{ shipDetail.device_id }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">TANGGAL PENDAFTARAN</th>
                <td>{{ shipDetail.submitted_at }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">TANGGAL DISETUJUI</th>
                <td>{{ shipDetail.responded_at }}</td>
              </tr>
            </tbody>
          </table>

          <div class="row">
            <div class="col-md mb-4 mb-md-2">
              <div class="accordion mt-3" id="accordionWithIcon">
                <div class="accordion-item card">
                  <h2 class="accordion-header d-flex align-items-center bg-info">
                    <button type="button" class="accordion-button collapsed bg-info text-white" data-bs-toggle="collapse" data-bs-target="#accordionWithIcon-2" aria-expanded="false">
                      <i class="ti ti-history ti-xs me-2"></i>
                      <span style="font-weight: bolder">HISTORY PAIRING</span>
                    </button>
                  </h2>
                  <div id="accordionWithIcon-2" class="accordion-collapse collapse bg-soft-white">
                    <div class="accordion-body">
                      <table class="table table-border">
                        <thead class="bg-white text-dark">
                          <tr>
                            <th style="font-weight: bolder">NO</th>
                            <th style="font-weight: bolder">KAPAL</th>
                            <th style="font-weight: bolder">PENANGGUNG JAWAB</th>
                            <th style="font-weight: bolder">NOMOR HP</th>
                          </tr>
                        </thead>
                        <tbody class="text-dark">
                          <tr v-for="(data, index) in historyPairing" :key="index++">
                            <th>{{ index }}</th>
                            <th>{{ data.ship_name }}</th>
                            <th>{{ data.responsible_name }}</th>
                            <th>{{ data.phone }}</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--/ Accordion with Icon -->
          </div>
        </div>
        <div class="modal-footer mt-2">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from "aos"
import axios from "axios"
import Swal from "sweetalert2"
import { onMounted, ref } from "vue"
import "@/assets/custom-vue/css/pagination.css"

export default {
  name: "AcceptedPage",
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
      acceptedList: [],
      shipDetail: [],
      historyPairing: [],

      currentPage: 1,
      itemsPerPage: 10,
      rowsOptions: [10, 15, 50, 100],
      searchQuery: ""
    }
  },

  computed: {
    filteredApprovedData() {
      if (!this.acceptedList) {
        return []
      }
      const searchQuery = this.searchQuery.toLowerCase()
      return this.acceptedList.filter((item) => item.status === "approved" && Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery)))
    },
    paginatedApprovedData() {
      if (this.itemsPerPage === "ALL") {
        return this.filteredApprovedData
      }
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredApprovedData.slice(startIdx, endIdx)
    },
    totalPages() {
      if (this.itemsPerPage === "ALL") {
        return 1
      }
      return Math.ceil(this.filteredApprovedData.length / this.itemsPerPage)
    }
  },

  methods: {
    async fetchShipAccepted() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      try {
        const response = await axios.get("/api/v1/ship/pairing-request", config)
        this.acceptedList = response.data.data
        console.log("💚 ACCEPTED FETCHED", this.acceptedList)
      } catch (error) {
        console.error("💥 ACCEPTED ERROR :", error)
      }
    },
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
    },

    async fetchShipAcceptedDetail(username) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      axios
        .get(`/api/v1/ship/pairing/detail?username=${username}`, config)
        .then((res) => {
          this.shipDetail = res.data.data
          this.historyPairing = res.data.data.history_pairing

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
      const filteredApprovedData = this.filteredApprovedData

      if (filteredApprovedData.length === 0) {
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

      const header = Object.keys(filteredApprovedData[0]).join(",")
      const rows = filteredApprovedData.map((ship) => Object.values(ship).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `PENGAJUAN_DISETUJUI_${formattedDate}.csv`)
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
  },

  watch: {
    itemsPerPage() {
      this.updatePagination()
    }
  },
  mounted() {
    console.clear()
    this.fetchShipAccepted()
  }
}
</script>

<style>
@media screen and (max-width: 1000px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>
