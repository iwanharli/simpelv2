<template>
  <b-row class="p-4">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-left" data-aos-delay="110">
        <b-card-header class="bg-secondary pb-3">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">PENGAJUAN <span style="color: #ffb72d">PENDING</span></h4>
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
                <tr class="text-white" style="background: #000f25e0; border-top: 1px solid white;">
                  <th scope="col" class="text-center" style="font-weight: bolder; width: 5px">ID</th>
                  <th scope="col" style="font-weight: bolder">NAMA KAPAL</th>
                  <th scope="col" style="font-weight: bolder">PENANGGUNG JAWAB</th>
                  <th scope="col" class="text-center" style="font-weight: bolder; width: 5%">NOMOR HP</th>
                  <th scope="col" class="text-center" style="font-weight: bolder">PENGAJUAN</th>
                  <th scope="col" class="text-center" style="min-width: 20px">
                    <input type="checkbox" @change="selectAllRows" v-model="selectAll" />
                  </th>
                  <th scope="col" style="width: 5%">
                    <button @click="performBulkACC" class="btn btn-sm btn-primary waves-effect waves-light" type="button" :disabled="selectedPending.length === 0" style="width: 100%;">
                      <i class="ti ti-checks me-xs-1"></i> &nbsp; BULK ACC
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody style="background: white;">
                <tr v-if="!filteredPendingData || filteredPendingData.length === 0">
                  <td colspan="6" class="bg-soft-white">Data kosong</td>
                </tr>

                <tr v-for="(item, index) in paginatedApprovedData" :key="index" data-aos="fade-left" :data-aos-delay="100 * (index + 2)" v-else>
                  <td class="text-center bg-soft-light">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder" data-label="🚢">
                    {{ item.ship_name }}
                  </td>
                  <td class="p-2" data-label="👲">
                    <span style="font-weight: bold; text-transform: uppercase">{{ item.responsible_name }}</span> <br />
                    <small>📱{{ item.device_id }}</small>
                  </td>
                  <td class="p-2" data-label="📱">
                    <a :href="getWhatsAppLink(item.phone)" type="button" class="btn btn-sm btn-info p-2" target="_blank" style="display: flex; gap: 10px; align-items: center">
                      <img src="@/assets/images/icon/whatsapp.png" width="20" height="20" style="display: inline-block; box-shadow: 0 0 5px white; border-radius: 5px" />
                      <span style="display: inline-block; color: white !important">{{ item.phone }}</span>
                    </a>
                  </td>
                  <td class="text-center">
                    {{ item.created_at }}
                  </td>
                  <td class="text-center bg-soft-dark">
                    <input type="checkbox" v-model="selectedPending" :value="item" />
                  </td>
                  <td class="text-center bg-soft-primary p-2">
                    <a @click="pendingApproveSubmit(item.id)" class="btn btn-md btn-success waves-effect waves-light" type="button">
                      <i class="ti ti-checks me-xs-1"></i>
                    </a>
                    &nbsp;
                    <a @click="pendingDeclineSubmit(item.id)" class="btn btn-md btn-danger waves-effect waves-light" type="button">
                      <i class="ti ti-ban me-xs-1"></i>
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
  name: "PendingPage",
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
      pendingList: [],
      searchQuery: "",

      currentPage: 1,
      itemsPerPage: 10,

      selectAll: false,
      selectedPending: []
    }
  },

  computed: {
    filteredPendingData() {
      this.currentPage = 1

      const searchQuery = this.searchQuery.toLowerCase()
      return this.pendingList.filter((item) => item.status === "pending" && Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery)))
    },
    paginatedApprovedData() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredPendingData.slice(startIdx, endIdx)
    },
    totalPages() {
      return Math.ceil(this.filteredPendingData.length / this.itemsPerPage)
    }
  },

  mounted() {
    console.clear()
    this.fetchShipPending()
  },

  methods: {
    async fetchShipPending() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("/api/v1/ship/pairing-request", config)
        .then((response) => {
          this.pendingList = response.data.data

          console.log("💚 PENDING FETCHED", this.pendingList)
        })
        .catch((error) => {
          console.error("💥 PENDING ERROR :" + error)
        })
    },

    async pendingApproveSubmit(id) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        pairing_id: id.toString(),
        status: "approved"
      }

      // console.log(updatedData)

      axios
        .put("/api/v1/ship/pairing/action", updatedData, config)
        .then((response) => {
          console.log("💚 ACC SUCCESS", updatedData)

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
            title: "Berhasil ACC"
          })

          this.fetchShipPending()
        })
        .catch((error) => {
          console.error("💥 ACC GAGAL :", error)
        })
    },

    async pendingDeclineSubmit(id) {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        pairing_id: id.toString(),
        status: "rejected"
      }

      Swal.fire({
        icon: "warning",
        title: "Yakin ingin menolak?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak"
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put("/api/v1/ship/pairing/action", updatedData, config)
            .then((response) => {
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
                icon: "success",
                title: "Berhasil Menolak"
              })

              console.log("💚 DECLINE SUCCESS", updatedData)
              this.fetchShipPending()
            })
            .catch((error) => {
              console.error("💥 DECLINE GAGAL :", error)
            })
        }
      })
    },

    selectAllRows() {
      if (this.selectAll) {
        this.selectedPending = this.pendingList.slice()
      } else {
        this.selectedPending = [] // Deselect all rows
      }
    },

    performBulkACC() {
      const selectedPendingIds = this.selectedPending.map((item) => item.id)
      console.log(selectedPendingIds)

      const resultString = selectedPendingIds.join(",")

      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      console.log("a", resultString)

      const updatedData = {
        pairing_id: resultString,
        status: "approved"
      }

      console.log("💚 PENDING", updatedData)

      axios
        .put("/api/v1/ship/pairing/action", updatedData, config)
        .then((response) => {
          console.log("💚 BULK ACC SUCCESS", updatedData, response)

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
            title: "Berhasil ACC"
          })

          this.fetchShipPending()
        })
        .catch((error) => {
          console.error("💥 ACC GAGAL :", error)
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
      const filteredPendingData = this.filteredPendingData

      if (filteredPendingData.length === 0) {
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

      const header = Object.keys(filteredPendingData[0]).join(",")
      const rows = filteredPendingData.map((ship) => Object.values(ship).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `PENGAJUAN_PENDING_${formattedDate}.csv`)
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