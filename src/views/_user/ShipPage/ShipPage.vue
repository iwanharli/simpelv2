<template>
  <!-- ISI  -->
  <b-row class="p-5 pb-2">
    <b-col xl="12" lg="12" md="12" sm="12" class="bg-primary mb-3 p-4" style="border-radius: 20px; border: 2px solid white" data-aos="fade-down" data-aos-delay="110">
      <div class="header-title">
        <b-row>
          <b-col xl="3" lg="8" md="7" sm="7">
            <h4 style="font-weight: bold; color: white">KAPAL TERDAFTAR</h4>
          </b-col>
          <b-col></b-col>
          <b-col></b-col>
          <b-col xl="3" lg="4" md="5" sm="5" class="d-flex justify-content-end custom-export">
            <button style="display: inline-block" class="btn btn-secondary" type="button" id="kapal_detail" @click="downloadCSV"><i class="ti ti-download me-sm-1"></i> EXPORT CSV</button>
          </b-col>
          <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
            <input type="text" class="form-control border-0" placeholder="Pencarian (Kapal / Penanggung Jawab / Device ID / Terdaftar)" v-model="searchQuery" />
          </b-col>
        </b-row>
      </div>
    </b-col>

    <!-- PAGINATION  -->
    <!-- <b-col xl="1" lg="1" md="2" sm="2" class="button-prev-next-lg text-end" data-aos="fade-left" data-aos-delay="110">
      <button @click="currentPage -= 1" :disabled="currentPage === 1" class="prev-next-button-ship">
        <img src="@/assets/images/previous.png" class="previous" style="width: 60px; height: 60px" />
      </button>
    </b-col> -->

    <!-- <div class="button-prev-next-sm">
      <b-col col="12" class="d-flex align-items-center justify-content-center mt-4 mb-3">
        <b-row class="d-flex">
          <b-col class="text-center">
            <button @click="currentPage -= 1" :disabled="currentPage === 1" class="prev-next-button-ship">
              <img src="@/assets/images/previous.png" class="previous" style="width: 50px; height: 50px" />
            </button>
          </b-col>

          <b-col class="text-center">
            <button @click="currentPage += 1" :disabled="currentPage === totalPages" class="prev-next-button-ship">
              <img src="@/assets/images/next.png" class="next" style="width: 50px; height: 50px" />
            </button>
          </b-col>
        </b-row>
      </b-col>
    </div> -->

    <!-- <b-col xl="1" lg="1" md="2" sm="2" class="button-prev-next-lg" data-aos="fade-right" data-aos-delay="110">
      <button @click="currentPage += 1" :disabled="currentPage === totalPages" class="prev-next-button-ship">
        <img src="@/assets/images/next.png" class="next" style="width: 60px; height: 60px" />
      </button>
    </b-col> -->
  </b-row>

  <b-row>
    <b-col class="p-5 pt-0 pb-0">
      <div class="ag-courses_box">
        <div class="ag-courses_item" v-for="(item, index) in paginatedShipData" :key="index" style="border: 3px solid white">
          <RouterLink :to="{ name: 'admin.shipDetail', params: { shipId: item.id } }">
            <div class="ag-courses-item_link bg-dark">
              <!-- HOVER  -->
              <div class="ag-courses-item_bg" style="background-color: #3e5fcd" v-if="item.status === 'checkin'"></div>
              <div class="ag-courses-item_bg" style="background-color: #f9b234" v-if="item.status === 'checkout'"></div>
              <div class="ag-courses-item_bg" style="background-color: #969696" v-if="item.status === 'out of scope'"></div>

              <div class="ag-courses-item_name">
                ⛵ &nbsp; <span class="ag-courses-item_date"> {{ item.ship_name }} </span>
              </div>
              <div class="ag-courses-item_name">
                👲 &nbsp; <span class="ag-courses-item_date"> {{ item.responsible_name }} </span>
              </div>
              <hr />
              <div class="ag-courses-item_detail">
                📆 &nbsp; &nbsp; <span> {{ item.created_at }} </span>
              </div>
              <div class="ag-courses-item_detail">
                📱 &nbsp; &nbsp; <span> {{ item.device_id }} </span>
              </div>

              <div class="ag-courses-item-status">
                <div class="circle" style="width: 50px; height: 50px" v-if="item.on_ground === 0">
                  <div class="wave"></div>
                </div>
                <div class="circle-walking" style="width: 50px; height: 50px" v-else>
                  <img src="@/assets/images/walk.gif" style="width: 40px; height: 40px" />
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </b-col>
  </b-row>
  <b-row>
    <b-col xl="12" lg="12" md="12" sm="12" style="padding: 0px 25px 25px 25px" :style="{ animation: 'fadeUp 1s ease ' }">
      <b-col xl="12" lg="12" md="12" sm="12" class="d-flex align-items-center justify-content-center">
        <div class="p-3 bg-soft-secondary" style="border-radius: 20px">
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :disabled="currentPage === page" :class="{ 'pagination-button': true, active: currentPage === page }">
            {{ page }}
          </button>
        </div>
      </b-col>
    </b-col>
  </b-row>
  <test />
</template>

<script>
import AOS from "aos"
import axios from "axios"
import Swal from "sweetalert2"
import Vue3autocounter from "vue3-autocounter"
import "@/assets/custom-vue/css/pagination.css"

import { onMounted } from "vue"
import { RouterLink } from "vue-router"

export default {
  name: "Ship Page",
  components: {
    Vue3autocounter,
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
      searchQuery: "",

      currentPage: 1,
      itemsPerPage: 12
    }
  },
  computed: {
    filteredShip() {
      this.currentPage = 1

      const query = this.searchQuery.toLowerCase()
      return this.ships.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().includes(query)))
    },
    paginatedShipData() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredShip.slice(startIdx, endIdx)
    },
    totalPages() {
      return Math.ceil(this.filteredShip.length / this.itemsPerPage)
    }
  },

  mounted() {
    this.fetchShip()
  },

  methods: {
    async fetchShip() {
      try {
        const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
        const params = { page: this.page }

        const response = await axios.get("/api/v1/ship/list", { ...config, params })

        if (response.data.data) {
          this.ships = response.data.data.map((ship) => {
            const datetimeString = ship.created_at
            const parts = datetimeString.split(" ")
            ship.created_at = parts[0]

            return ship
          })

          this.maxPage = Math.ceil(this.ships.length / this.pageSize)

          this.hasPreviousPage = this.page > 1
          this.hasNextPage = response.data.data.length === this.pageSize

          console.clear()
          console.log("💚 SHIP FETCHED", this.ships)
        } else {
          console.error("💥 SHIP DATA IS NULL OR UNDEFINED")
        }
      } catch (error) {
        console.error("💥 SHIP ERROR :", error)
      }
    },

    downloadCSV() {
      if (this.ships.length === 0) {
        console.warn("⚠️ NO APPROVED DATA")
        return
      }

      const header = Object.keys(this.ships[0]).join(",")
      const rows = this.ships.map((ship) => Object.values(ship).join(","))
      const csvContent = `${header}\n${rows.join("\n")}`
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      const currentDate = new Date()
      const formattedDate = this.formatDate(currentDate)

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `KAPAL_TERDAFTAR_${formattedDate}.csv`)
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

<style>
@import url("https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@300;400;500;600;800&display=swap");

*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.circle {
  position: absolute;
  top: 55%;
  left: 90%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
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
  margin: 0 0 15px;
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

.ag-courses-item-status {
  font-size: 18px;
  color: #fff;
  z-index: 2;
  text-transform: uppercase;
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
