<template>
  <b-row class="p-4">
    <!-- ARRIVAL  -->
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-warning pb-3">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">TAGIHAN KAPAL</h4>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                <select class="form-select-sm" v-model="itemsPerPage" @change="updatePagination" :style="{ width: '70px' }">
                  <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                <button type="button" class="btn btn-sm btn-danger" style="display: inline-block; margin-left: 10px; border: 2px solid white"  @click="printPDF()">
                  <i class="ti ti-download me-sm-1"></i>
                  EXPORT CSV
                </button>
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Nama Kapal) - tekan enter" v-model="searchQuery" @keyup.enter="fetchShipArrival" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0" ref="pdfContent2">
          <div class="table-responsive">
            <table id="basic-table" class="table table-border mb-0" role="grid">
              <thead>
                <tr class="text-white" style="background: #000f25e0; border-top: 1px solid white">
                  <th style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                  <th style="font-weight: bolder">NAMA KAPAL</th>
                  <th style="font-weight: bolder" class="text-center">CHECK IN</th>
                  <th style="font-weight: bolder" class="text-center">CHECK OUT</th>
                  <th style="font-weight: bolder">TOTAL BIAYA</th>
                  <th style="width: 5%"></th>
                  <th style="width: 5%"></th>
                </tr>
              </thead>
              <tbody style="background: white">
                <tr v-for="(item, index) in this.shipDebt" :key="index++">
                  <td class="text-center bg-soft-light">
                    {{ index }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.ship_name }}
                  </td>
                  <td class="text-center">{{ item.check_in_at }}</td>
                  <td class="text-center">
                    <span v-if="item.check_out_at">{{ item.check_out_at }}</span>
                    <span v-else class="badge bg-warning text-white py-1">Belum</span>
                  </td>
                  <td style="background: #ff956159; font-weight: bolder">
                    {{ formatCurrency(item.dock_cost) }}
                  </td>
                  <td style="background: #ff7e3f59">
                    <b-button size="sm" variant="info" style="border-radius: 20px" data-bs-toggle="modal" data-bs-target="#modalViewPaymentDetail" @click="viewPaymentDetail(item.id)"> <i class="ti ti-search me-xs-1"></i></b-button> &nbsp;
                    <b-button size="sm" variant="primary" style="border-radius: 20px"> <i class="ti ti-printer me-xs-1"></i></b-button>
                  </td>
                  <td class="text-center bg-soft-primary" style="border-bottom: 1px solid #aebbff">
                    <b-button size="md" variant="success" v-if="!item.paid_at" @click="payDebt(item.id)"> <i class="ti ti-credit-card-pay me-xs-1"></i> &nbsp; BAYAR </b-button>
                  </td>
                </tr>

                <!-- <tr v-for="(item, index) in this.shipDebt" :key="index++">
                  <td class="text-center bg-soft-light">
                    {{ index }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.ship_name }}
                  </td>
                  <td>{{ item.check_in_at }}</td>
                  <td>{{ item.check_out_at || "-" }}</td>
                  <td style="background: #ff956159">
                    {{ formatCurrency(item.dock_cost) }}
                  </td>
                  <td style="background: #ff7e3f59">
                    <b-button size="sm" variant="info" style="border-radius: 20px" @click="viewPaymentDetail(debt.id)"> <i class="ti ti-eye me-xs-1"></i></b-button> &nbsp;
                    <b-button size="sm" variant="primary"> <i class="ti ti-printer me-xs-1"></i></b-button>
                  </td>
                  <td class="text-center bg-soft-primary" style="border-bottom: 1px solid #aebbff">
                    <b-button size="sm" variant="success" v-if="!item.paid_at" @click="payDebt(item.id)"> <i class="ti ti-checks me-xs-1"></i> &nbsp; BAYAR </b-button>
                  </td>
                </tr> -->
              </tbody>
            </table>

            <!-- PAGINATION  -->
            <div class="pagination-container p-3 bg-soft-secondary" style="border-radius: 0px 0px 20px 20px">
              <button @click="currentPage -= 1" :disabled="currentPage === 1" class="prev-next-button"><span>&#9665;</span> Previous</button>
              <button v-for="page in totalPages" :key="page" @click="currentPage = page" :disabled="currentPage === page" :class="{ 'pagination-button': true, active: currentPage === page }">
                {{ page }}
              </button>
              <button @click="currentPage += 1" :disabled="currentPage === totalPages" class="prev-next-button">Next <span>&#9655;</span></button>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>

  <!-- MODAL DETAIL  -->
  <div class="modal fade" id="modalViewPaymentDetail" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">DETAIL BIAYA LABUH KAPAL</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-border" v-if="this.shipDebt">
            <tbody>
              <tr>
                <th class="text-dark" style="font-weight: bolder; width: 50px">KAPAL</th>
                <td style="font-weight: bold; text-transform: uppercase">{{ shipDetail.ship_name }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">WAKTU CHECK IN</th>
                <td>{{ shipDetail.check_in_at }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">WAKTU CHECK OUT</th>
                <td>
                  <span v-if="shipDetail.check_out_at">{{ shipDetail.check_out_at }}</span>
                  <span v-else class="badge bg-soft-warning text-warning py-1">Belum</span>
                </td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">BIAYA LABUH</th>
                <td style="font-weight: bolder">{{ formatCurrency(shipDetail.dock_cost) }}</td>
              </tr>
              <tr>
                <th class="text-dark" style="font-weight: bolder">WAKTU DIBAYAR</th>
                <td>
                  <span v-if="shipDetail.paid_at">{{ shipDetail.paid_at }}</span>
                  <span v-else class="badge bg-soft-warning text-warning py-1">Belum</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="row" v-if="shipDetail.diff_cost !== 0">
            <div class="col-md mb-4 mb-md-2">
              <div class="accordion mt-3" id="accordionWithIcon">
                <div class="accordion-item card">
                  <h2 class="accordion-header d-flex align-items-center">
                    <button type="button" class="accordion-button collapsed bg-danger text-white" data-bs-toggle="collapse" data-bs-target="#accordionPenalty" aria-expanded="false">
                      <i class="ti ti-history ti-xs me-2"></i>
                      <span style="font-weight: bolder">PENALTY</span>
                    </button>
                  </h2>
                  <div id="accordionPenalty" class="accordion-collapse collapse bg-soft-white">
                    <div class="accordion-body p-0">
                      <table class="table table-border">
                        <tbody>
                          <tr>
                            <th class="text-dark" style="font-weight: bolder">BIAYA TAMBAHAN</th>
                            <td style="font-weight: bolder">{{ formatCurrency(shipDetail.diff_cost) }}</td>
                          </tr>
                          <tr>
                            <th class="text-dark" style="font-weight: bolder">SELISIH WAKTU PEMBAYARAN</th>
                            <td>{{ shipDetail.diff_paid_at || "-" }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer mt-2">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <!-- FOR PRINT  -->
  <div ref="pdfContent" class="pdf-content">
    <table>
      <thead>
        <tr>
          <th>Ship Name</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Dock Cost</th>
          <th>Paid At</th>
          <th>Difference Cost</th>
          <th>Difference Paid At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in debts" :key="index">
          <td>{{ item.ship_name }}</td>
          <td>{{ item.check_in_at }}</td>
          <td>{{ item.check_out_at }}</td>
          <td>{{ formatCurrency(item.dock_cost) }}</td>
          <td>{{ item.paid_at }}</td>
          <td>{{ item.diff_cost }}</td>
          <td>{{ item.diff_paid_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted, ref } from "vue"
import VueMultiselect from "vue-multiselect"
import "@/assets/custom-vue/css/pagination.css"
import html2pdf from "html2pdf.js"

export default {
  name: "DebtPage",
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
      shipDebt: [],
      shipDetail: [],

      currentPage: 1,
      rowsPerPage: 10,
      rowsOptions: [10, 15, 50, "ALL"],
      searchQuery: "",
      intervalId: null
    }
  },

  mounted() {
    this.fetchShipDebt()
    this.intervalId = setInterval(this.fetchShipDebt, 30000) //30 detik
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  methods: {
    async fetchShipDebt() {
      const config = {
        params: {
          search: this.searchQuery
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }

      try {
        const res = await axios.get("/api/v1/debt/", config)
        this.shipDebt = res.data.data
        this.currentPage = 1

        console.log("💚 SHIP DEBT FETCHED", this.shipDebt)
      } catch (error) {
        console.error("💥 SHIP DEBT ERROR :", error)
      }
    },

    async viewPaymentDetail(id) {
      this.shipDetail = this.shipDebt.find((debt) => debt.id === id)

      if (this.shipDetail) {
        console.log(`💚 Viewing payment details for debt ID: ${id}`)
        console.log(this.shipDetail)
      } else {
        console.error("Debt not found")
      }

      // const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      // axios
      //   .get(`/api/v1/inspection/`, config)
      //   .then((res) => {
      //     // this.shipDetail = res.data.data

      //     console.log(`💚 Viewing payment details for debt ID: ${id}`)
      //     console.log("💚 SHIP DETAIL PAYMENT FETCHED", this.shipDetail)
      //   })
      //   .catch((error) => {
      //     console.error("💥 SHIP DETAIL PAYMENT ERROR :", error)
      //     return
      //   })
    },

    async payDebt(id) {
      // Logic for handling the payment (e.g., API call or redirection to payment page)
      console.log(`Paying for debt ID: ${id}`)
      alert(`Redirecting to payment process for debt ID: ${id}`)
    },

    

    async printPDF() {
      const element = this.$refs.pdfContent2
      const options = {
        margin: 0,
        filename: "debts_report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" }
      }
      await html2pdf().from(element).set(options).save()
    },

    formatCurrency(value) {
      const formattedValue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Minimum of 0 decimal places
        maximumFractionDigits: 2 // Maximum of 2 decimal places
      }).format(value)

      // Remove trailing zeros
      return formattedValue.replace(/\,00$/, "").replace(/\,0$/, "")
    },

    numberToWords(num) {
      const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]

      if (num < 12) {
        return words[num]
      } else if (num < 20) {
        return words[num - 10] + " belas"
      } else if (num < 100) {
        return words[Math.floor(num / 10)] + " puluh " + words[num % 10]
      } else if (num < 200) {
        return "seratus " + numberToWords(num - 100)
      } else if (num < 1000) {
        return words[Math.floor(num / 100)] + " ratus " + numberToWords(num % 100)
      } else if (num < 2000) {
        return "seribu " + numberToWords(num - 1000)
      } else if (num < 1000000) {
        return numberToWords(Math.floor(num / 1000)) + " ribu " + numberToWords(num % 1000)
      } else if (num < 1000000000) {
        return numberToWords(Math.floor(num / 1000000)) + " juta " + numberToWords(num % 1000000)
      }
      return "angka terlalu besar"
    },

    formatCurrencyInWords(value) {
      const words = numberToWords(value)
      return `${words} rupiah`
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
  },
  created() {
    // this.fetchShipDebt()
  }
}
</script>

<style>
tr td {
  /* padding: 10px 25px !important; */
}

.pdf-content {
  display: none;
}
</style>
