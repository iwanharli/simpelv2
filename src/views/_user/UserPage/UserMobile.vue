<template>
  <b-row class="p-4">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-primary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="12" lg="12" md="12" sm="12">
                <h4 style="font-weight: bold; color: white">DAFTAR PENGGUNA MOBILE</h4>
              </b-col>
              <b-col xl="12" lg="12" md="12" sm="12" class="mt-3">
                <input type="text" class="form-control border-0" placeholder="Pencarian (Nama / Role / Email)" v-model="searchQuery" />
              </b-col>
            </b-row>
          </div>
        </b-card-header>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table id="basic-table table-border" class="table table-md mb-0" role="grid">
              <thead>
                <tr class="text-white" style="background: #758cff;">
                  <th style="font-weight: bolder; width: 5px" class="text-center">ID</th>
                  <th style="font-weight: bolder">NAMA KAPAL</th>
                  <th style="font-weight: bolder">USERNAME</th>
                  <th style="width: 15%; font-weight: bolder" class="text-center">ROLE</th>
                  <th style="font-weight: bolder" class="text-center">PEMBARUAN TERAKHIR</th>
                  <th style="font-weight: bolder" class="text-center">TANGGAL TERDAFTAR</th>
                  <th style="width: 5%"></th>
                </tr>
              </thead>
              <tbody style="background: white;">
                <tr v-for="(item, index) in paginatedUserData" :key="index">
                  <td class="text-center bg-soft-light">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td style="text-transform: uppercase; font-weight: bolder">
                    {{ item.name }}
                  </td>
                  <td style="text-transform: lowercase; font-weight: bolder">
                    {{ item.username }}
                  </td>
                  <td class="text-center" style="text-transform: uppercase">
                    <span class="badge bg-soft-secondary text-secondary" v-if="item.role === 'User'" style="padding: 5px">{{ item.role }}</span>
                  </td>
                  <td class="text-center">{{ item.updated_at }}</td>
                  <td class="text-center">{{ item.created_at }}</td>
                  <td class="text-center bg-soft-primary">
                    <div class="flex align-items-center list-user-action">
                      <a class="btn btn-md btn-icon btn-info" data-bs-toggle="modal" data-bs-target="#modalEditUserMobile" @click="editUserMobile(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <!-- {{ item }} -->
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- PAGINATION -->
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

  <div class="modal fade" id="modalEditUserMobile" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT USER</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Nama</label>
              <input type="text" class="form-control" v-model="user.name" disabled />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" v-model="user.username" disabled />
            </div>
            <div class="col-12 mb-3">
              <label for="password" class="form-label">Password</label>
              <b-input-group size="md" class="mb-2">
                <b-form-input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="user.password" id="password" aria-describedby="password"></b-form-input>
                <b-input-group-append is-text>
                  <b-form-checkbox switch class="mr-n2" @click="togglePasswordVisibility"> </b-form-checkbox>
                </b-input-group-append>
              </b-input-group>
            </div>
          </div>
        </div>
        <div class="modal-footer mt-2">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submitEdit()">EDIT</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">CANCEL</button>
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

import "@/assets/custom-vue/css/pagination.css"

export default {
  name: "UserPage",
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
      showPassword: false,
      searchQuery: "",

      userData: [],
      searchQuery: "",

      inputName: "",
      inputEmail: "",
      inputPassword: "",
      inputRole: "",

      currentPage: 1,
      itemsPerPage: 10,

      user: {
        id: "",
        name: "",
        username: "",
        email: "",
        role: "",
        password: ""
      }
    }
  },

  mounted() {
    this.fetchUsers()
  },

  computed: {
    filteredUserData() {
      const query = this.searchQuery.toLowerCase()
      return this.userData.filter((user) => user.role === "User" && Object.values(user).some((value) => value.toString().toLowerCase().includes(query)))
    },
    paginatedUserData() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage
      const endIdx = startIdx + this.itemsPerPage
      return this.filteredUserData.slice(startIdx, endIdx)
    },
    totalPages() {
      return Math.ceil(this.filteredUserData.length / this.itemsPerPage)
    }
  },

  methods: {
    async fetchUsers() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      await axios
        .get("/api/v1/user/list?limit=1000", config)
        .then((response) => {
          this.userData = response.data.data

          // this.userData.forEach((user) => {
          //   if (user.role === "User") {
          //     console.log(user.role)

          //     return this.userData
          //   } else {
          //     return []
          //   }
          // })

          console.log("💚 USERS FETCHED", this.userData)
        })
        .catch((error) => {
          console.error("💥 USERS ERROR :", error)
        })
    },

    async editUserMobile(item) {
      console.log(item)

      this.user.id = item.id
      this.user.name = item.name
      this.user.username = item.username
      this.user.password = item.password
    },

    async submitEdit() {
      const updatedData = {
        password: this.user.password,
        password_confirmation: this.user.password
      }

      console.log(updatedData)

      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      const userId = parseInt(this.user.id)
      const url = `/api/v1/user/admin/change-password/${userId}`

      await axios
        .post(url, updatedData, config)
        .then((response) => {
          console.log("🚀 UPDATE PASSWORD BERHASIL", response)
          this.fetchUsers()

          Swal.fire({
            title: "Terimakasih!",
            text: "User telah berhasil diupdate 😊",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          })

          this.user.password = ""
        })
        .catch((error) => {
          console.error("💥 UPDATE FAILED:", error)

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
            text: error.response.data.meta.message
          })
        })
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
  }
}
</script>

<style>
.prev-next-button {
  border: 2px solid #4285f4 !important;
  background-color: #4285f4 !important;
  color: white;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
