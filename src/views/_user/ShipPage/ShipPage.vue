<template>
  <div>
    <b-row style="padding-left: 30px; padding-right: 20px; padding-top: 30px; position: relative; top: 80px">
      <b-col xl="12">
        <div class="card card-custom bg-soft-light" data-aos="fade-left" data-aos-delay="110">
          <b-card-header class="pb-4" style="background: #7000ff; border-radius: 10px 10px 0px 0px">
            <div class="header-title">
              <b-row>
                <b-col xl="6" lg="6" md="6" sm="5">
                  <h4 style="font-weight: bold; color: white">KAPAL TERDAFTAR</h4>
                </b-col>
                <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                  <select class="form-select-sm" v-model="rowsPerPage" @change="fetchData" :style="{ width: '70px' }">
                    <option v-for="option in rowsOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <button type="button" id="kapal_detail" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modalAddShip" style="display: inline-block; margin-left: 10px; border: 1px solid white"><i class="ti ti-plus me-sm-1"></i> KAPAL</button>
                  <button type="button" id="kapal_detail" class="btn btn-sm btn-warning" style="display: inline-block; margin-left: 10px" @click="downloadCSV"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button>
                </b-col>
                <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                  <input type="text" class="form-control border-0" placeholder="Pencarian (Nama Kapal / Device ID) - tekan enter" v-model="searchQuery" @keyup.enter="fetchData" />
                </b-col>
              </b-row>
            </div>
          </b-card-header>

          <!-- REGISTERED SHIP TABLE -->
          <b-card-body class="p-0">
            <div class="table-responsive">
              <table id="basic-table" class="table table-border mb-0" role="grid">
                <thead>
                  <tr class="text-white" style="background: #7000ff94; border-top: 1px solid white">
                    <th style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                    <th style="font-weight: bolder">NAMA KAPAL</th>
                    <th style="font-weight: bolder">NAMA PENANGGUNG JAWAB</th>
                    <th style="font-weight: bolder" class="text-center">STATUS</th>
                    <th style="font-weight: bolder" class="text-center">TANGGAL TERDAFTAR</th>
                    <th style="width: 5%"></th>
                  </tr>
                </thead>
                <tbody style="background: white">
                  <tr v-if="!ships">
                    <td colspan="6" class="bg-soft-white">Data kosong</td>
                  </tr>

                  <tr v-for="(item, index) in ships" :key="index" data-aos="fade-left" :data-aos-delay="100 * (index + 2)">
                    <td class="text-center bg-soft-light">
                      {{ index + 1 }}
                    </td>
                    <td>
                      <span style="text-transform: uppercase; font-weight: bold">{{ item.ship_name }}</span> <br />
                      <small>📱 {{ item.device_id }}</small>
                    </td>
                    <td style="text-transform: uppercase; font-weight: bolder">
                      {{ item.responsible_name }}
                    </td>
                    <td class="text-center">
                      <img src="@/assets/images/sea2.gif" style="width: 45px; height: 45px; border-radius: 10px; background: #7f91ff; padding: 3px" v-if="item.on_ground === 0" />
                      <img src="@/assets/images/walk.gif" style="width: 45px; height: 45px; border-radius: 10px; background: #7f91ff; padding: 3px" v-else />
                    </td>
                    <td style="text-transform: uppercase" class="text-center">
                      {{ item.created_at }}
                    </td>
                    <td class="text-center bg-soft-primary">
                      <b-button size="sm" variant="info" @click="goToShipDetail(item.id)" :disabled="item.is_inspected === 1"> <i class="ti ti-eye me-xs-1"></i> &nbsp; DETAIL </b-button>
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
          </b-card-body>
        </div>
      </b-col>
    </b-row>

    <!-- MODAL  -->
    <div class="modal fade" id="modalAddShip" :v-model="showModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h4 class="modal-title text-white" style="font-weight: bold">TAMBAH KAPAL</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <b-row class="p-2" style="background: #959595">
              <b-col xl="8" lg="8" md="12" sm="12" style="margin-top: 5px; margin-bottom: 5px">
                <input type="text" class="form-control harbourName" id="harbourName" value="PELABUHAN NIZAM ZACHMAN" disabled />
              </b-col>
              <b-col xl="4" lg="4" md="12" sm="12" style="margin-top: 5px; margin-bottom: 5px">
                <input type="text" class="form-control harbourCode" id="harbourCode" v-model="form.harbour_code" required disabled />
              </b-col>
            </b-row>
            <div class="row p-2 mt-2">
              <div class="col-12 mb-3">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">IMEI</label>
                <input type="text" class="form-control" id="deviceId" v-model="form.device_id" required />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">Nama Kapal</label>
                <input type="text" class="form-control" id="shipName" v-model="form.ship_name" required />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">Nama Penanggung Jawab</label>
                <input type="text" class="form-control" id="responsibleName" v-model="form.responsible_name" required />
              </div>
              <div class="col-12 mb-3">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">Nomor WA</label>
                <input type="phone" class="form-control" id="phone" v-model="form.phone" required />
              </div>
              <div class="col-12 mb-3" style="display: none">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">Username</label>
                <input type="text" class="form-control" id="username" placeholder="optional" v-model="form.username" />
              </div>
              <div class="col-12 mb-3" style="display: none">
                <label class="form-label" for="validationDefault01" style="font-weight: bolder">Password</label>
                <input type="text" class="form-control" id="password" placeholder="optional" v-model="form.password" />
              </div>
            </div>
          </div>
          <div class="modal-footer mt-4">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="validationAddShip()">Tambah</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from "aos"
import axios from "axios"
import Swal from "sweetalert2"
// import Vue3autocounter from "vue3-autocounter"
import "@/assets/custom-vue/css/pagination.css"

import { onMounted } from "vue"
import { RouterLink } from "vue-router"

export default {
  name: "Ship Page",
  components: {
    // Vue3autocounter,
    RouterLink
  },

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
      ships: [],

      form: {
        harbour_code: 919191,
        ship_name: "",
        phone: "",
        responsible_name: "",
        device_id: "",
        firebase_token: "",
        username: "",
        password: ""
      },

      page: 1,
      rowsPerPage: 12,
      rowsOptions: [12, 24, 48, "ALL"],
      disableNext: false,
      searchQuery: ""
    }
  },

  methods: {
    async fetchData(tag) {
      const limit = this.rowsPerPage === "ALL" ? -1 : this.rowsPerPage
      const offset = (this.page - 1) * this.rowsPerPage

      try {
        const response = await axios.get("/api/v1/ship/list", {
          params: {
            limit: limit,
            offset: offset,
            search: this.searchQuery
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })

        if (response.data.data === null && tag === "next") {
          this.disableNext = true
          return
        }

        this.ships = response.data.data
        this.disableNext = false

        console.log("💚 SHIP FETCHED", this.ships)
      } catch (error) {
        console.error("💥 SHIP ERROR :", error)
      }
    },

    async validationAddShip() {
      if (!this.form.device_id || !this.form.ship_name || !this.form.responsible_name || !this.form.phone) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Tolong lengkapi semua data yang dibutuhkan!"
        })
        return
      } else {
        this.addShip()
      }
    },

    async addShip() {
      this.form.username = this.form.phone
      this.form.password = this.form.phone

      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      const addData = {
        harbour_code: this.form.harbour_code,
        ship_name: this.form.ship_name,
        phone: this.form.phone,
        responsible_name: this.form.responsible_name,
        device_id: this.form.device_id,
        firebase_token: this.form.firebase_token,
        username: this.form.username,
        password: this.form.password
      }
      // console.log(addData)

      try {
        const response = await axios.post("http://103.179.86.246:9016/api/v1/ship/pairing", addData, config)
        console.log("API Response:", response.data)
      } catch (error) {
        console.error("Error submitting form:", error.response.data.meta.message)

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.meta.message
        })
      }
    },

    goToShipDetail(shipId) {
      this.$router.push({ name: "admin.shipDetail", params: { shipId } })
    },

    downloadCSV() {
      const shipsData = this.ships

      if (shipsData.length === 0) {
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

      // Construct the CSV file content
      const header = Object.keys(shipsData[0]).join(",")
      const rows = shipsData.map((ship) => Object.values(ship).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `LIST_KAPAL_${formattedDate}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        console.error("💥 EXPORT FAILED, BROWSER DOESN'T SUPPORT BLOB/DOWNLOAD")

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
    },

    formatDate(date) {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${year}${month}${day}`
    },

    prevPage() {
      if (this.page > 1) {
        this.page--
        this.fetchData("prev")
      }
    },
    nextPage() {
      this.page++
      this.fetchData("next")
    }
  },

  watch: {
    rowsPerPage() {
      this.page = 1
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@300;400;500;600;800&display=swap");

.harbourName,
.harbourCode {
  text-align: center; /* Center the text horizontally */
  font-weight: bold;
  background-color: #d4d4d4 !important;
  color: black;
}

.pagination-controls button.active {
  font-weight: bold;
}

.pagination-controls button {
  margin: 0 5px;
}

.rows-per-page {
  margin-top: 10px;
}

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.circle {
  position: relative;
  top: 55%;
  left: 90%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border: 5px solid #70a7ff3d;
  box-shadow: 0 0 0 5px #6d8fff6c;
  border-radius: 50%;
  overflow: hidden;
}

.circle-walking {
  position: absolute;
  top: 55%;
  left: 90%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 5px solid #a294453d;
  box-shadow: 0 0 0 5px #be96396c;
  border-radius: 50%;
  overflow: hidden;
}
.wave {
  position: relative;
  top: 50;
  width: 100%;
  height: 100%;
  background: #0088ff;
  border-radius: 50%;
  box-shadow: inset 0 0 50px 0 rgba(0, 0, 0, 0.5);
}
.wave:before,
.wave:after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 200%;
  height: 200%;
  background: black;
  transform: translate(-50%, -75%);
}
.wave:before {
  border-radius: 45%;
  background: rgb(120, 167, 255);
  animation: animate 5s linear infinite;
  top: 8px;
}
.wave:after {
  border-radius: 40%;
  background: rgb(219, 240, 255);
  animation: animate 10s linear infinite;
}

.shadow {
  box-shadow: 8px 8px 15px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 8px 8px 15px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 8px 8px 15px 0px rgba(0, 0, 0, 0.75);
}

img.next:hover {
  animation: nextAnimation 1s infinite;
  border: 5px solid white;
  border-radius: 50px;
}

img.previous:hover {
  animation: previousAnimation 1s infinite;
  border: 5px solid white;
  border-radius: 50px;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(150px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nextAnimation {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes previousAnimation {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes animate {
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
}

.custom-btn {
  width: 100%;
}

.custom-label {
  width: 60%;
}

.custom-index {
  box-shadow: 5px 5px 15px 0px #7070705e;
  -webkit-box-shadow: 8px 8px 15px 0px rgba(135, 135, 135, 0.75);
  -moz-box-shadow: 8px 8px 15px 0px rgba(166, 166, 166, 0.75);
  border: 3px solid white;
}

.button-prev-next-sm {
  display: none;
}

.page-link.active,
.active > .page-link {
  background-color: #4abc96;
}

.prev-next-button-ship {
  border: 2px solid white;
  color: white;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.prev-next-button-ship:hover {
  border: 2px solid white;
  background-color: #00000083;
}

/* _____________________________________________________________________ */

@media (max-width: 1200px) {
  .custom-label {
    width: 30%;
  }

  .custom-ground {
    margin-top: 10px;
  }

  .circle {
    left: 80%;
  }

  .circle-walking {
    left: 80%;
  }

  .custom-responsible {
    margin-top: 30px;
    padding-left: 50px;
    margin-bottom: 20px;
  }

  .custom-date {
    margin-top: 30px;
  }

  .custom-detail {
    margin-top: 30px;
  }

  .custom-btn {
    width: 92%;
    float: right;
  }
}

@media (max-width: 992px) {
  .custom-label {
    width: 50%;
  }

  .circle {
    left: 80%;
  }

  .circle-walking {
    left: 80%;
  }

  .custom-responsible {
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 20px;
  }

  .custom-btn {
    width: 85%;
    float: right;
  }

  .button-prev-next-lg {
    display: none;
  }

  .button-prev-next-sm {
    display: contents;
  }
}

@media (max-width: 768px) {
  .custom-ship {
    margin-top: 20px;
  }

  .custom-ground {
    margin-top: 50px;
  }

  .custom-responsible {
    margin-top: 50px;
  }

  .custom-detail {
    margin-top: 20px;
  }

  .custom-btn {
    width: 100%;
    float: center;
  }

  b-card:hover {
    background: red !important;
  }
}

@media (max-width: 575.2px) {
  .custom-export {
    margin-top: 13px;
  }
}

@media (max-width: 400px) {
  .circle {
    display: none;
  }

  .circle-walking {
    display: none;
  }
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

/* ___________________________________________________________________  */

.ag-courses_box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.ag-courses_item {
  -ms-flex-preferred-size: calc(33.33333% - 30px);
  flex-basis: calc(33.33333% - 30px);
  margin: 0 15px 30px;
  overflow: hidden;
  border-radius: 28px;
}

.ag-courses-item_link {
  display: block;
  padding: 30px 20px;
  /* background-color: #141a2d; */
  overflow: hidden;
  position: relative;
}

.ag-courses-item_title:hover,
.ag-courses-item_link:hover,
.ag-courses-item_link:hover .ag-courses-item_date {
  text-decoration: none;
  color: #fff;
}

.ag-courses-item_link:hover .ag-courses-item_bg {
  -webkit-transform: scale(10);
  -ms-transform: scale(10);
  transform: scale(10);
}

.ag-courses-item_title {
  /* min-height: 50px; */
  margin: 0 0 15px;
  overflow: hidden;
  font-weight: bold;
  font-size: 25px;
  color: #f9b234;
  z-index: 2;
  position: relative;
  text-transform: uppercase;
}

.ag-courses-item_name {
  /* min-height: 50px; */
  margin: 0 0 0px;
  overflow: hidden;
  font-weight: bold;
  font-size: 20px;
  color: #f9b234;
  z-index: 2;
  position: relative;
  text-transform: uppercase;
}

.ag-courses-item_detail {
  font-size: 15px;
  color: #fff;
  z-index: 2;
  position: relative;
  text-transform: uppercase;
  word-break: break-all;
}

.ag-courses-item_date {
  font-weight: bold;
  color: #f9b234;
  -webkit-transition: color 0.5s ease;
  -o-transition: color 0.5s ease;
  transition: color 0.5s ease;
}

.ag-courses-item_bg {
  height: 150px;
  width: 130px;
  z-index: 1;
  position: absolute;
  top: -90px;
  right: -70px;
  border-radius: 70%;
  -webkit-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
  /* background-color: #f9b234; */
}

/* .ag-courses_item:nth-child(2n) .ag-courses-item_bg {
  background-color: #3ecd5e;
}

.ag-courses_item:nth-child(3n) .ag-courses-item_bg {
  background-color: #e44002;
} */

/* .ag-courses_item:nth-child(4n) .ag-courses-item_bg {
  background-color: #952aff;
}

.ag-courses_item:nth-child(5n) .ag-courses-item_bg {
  background-color: #cd3e94;
}

.ag-courses_item:nth-child(6n) .ag-courses-item_bg {
  background-color: #4c49ea;
} */

@media only screen and (max-width: 979px) {
  .ag-courses_item {
    -ms-flex-preferred-size: calc(50% - 30px);
    flex-basis: calc(50% - 30px);
  }
  .ag-courses-item_title {
    font-size: 24px;
  }
}

@media only screen and (max-width: 767px) {
  .ag-format-container {
    width: 96%;
  }
}
@media only screen and (max-width: 639px) {
  .ag-courses_item {
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
  }
  .ag-courses-item_title {
    min-height: 72px;
    line-height: 1;

    font-size: 24px;
  }
  .ag-courses-item_link {
    padding: 22px 40px;
  }
  .ag-courses-item_date-box {
    font-size: 16px;
  }
}
</style>
