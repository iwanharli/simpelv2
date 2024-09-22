<template>
  <b-row class="p-4">
    <b-col xl="12">
      <div class="card card-custom bg-soft-light" data-aos="fade-down" data-aos-delay="110">
        <b-card-header class="bg-primary text-light pb-4">
          <div class="header-title">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="5">
                <h4 style="font-weight: bold; color: white">DAFTAR PENGGUNA WEB</h4>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="7" class="d-flex justify-content-end custom-export">
                <button style="display: inline-block" class="btn btn-sm btn-warning" type="button" id="kapal_detail" data-bs-toggle="modal" data-bs-target="#modalAddUser">
                  <i class="ti ti-user-plus me-sm-1"></i>
                  TAMBAH PENGGUNA
                </button>
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
                  <th class="text-center" style="font-weight: bolder; width: 5px">ID</th>
                  <th class="text-center" style="width: 3%; font-weight: bolder">NAMA</th>
                  <th style="font-weight: bolder; padding: 5px 5px 16px 0px">PENGGUNA</th>
                  <th style="width: 15%; font-weight: bolder">EMAIL</th>
                  <th class="text-center" style="font-weight: bolder">TANGGAL TERDAFTAR</th>
                  <th style="width: 5%"></th>
                </tr>
              </thead>
              <tbody style="background: white">
                <tr v-for="(item, index) in paginatedUserData" :key="index">
                  <td class="text-center bg-soft-light">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="text-center p-0">
                    <img class="rounded img-fluid avatar-40" src="@/assets/images/user2.png" alt="profile" loading="lazy" v-if="item.role === 'superadmin'" />
                    <img class="rounded img-fluid avatar-40" src="@/assets/images/user.png" alt="profile" loading="lazy" v-else />
                  </td>
                  <td class="p-0">
                    <span style="font-weight: bold; text-transform: uppercase">
                      {{ item.name }}
                    </span>
                    <br />
                    <small>
                      <span class="badge bg-soft-danger text-danger" v-if="item.role === 'superadmin'" style="text-transform: capitalize; padding: 5px">{{ item.role }}</span>
                      <span class="badge bg-soft-info text-info" style="text-transform: capitalize; padding: 5px" v-else>{{ item.role }}</span>
                    </small>
                  </td>
                  <td>
                    {{ item.email }} &nbsp;
                    <span class="badge bg-warning" v-if="item.email_verified_at === ''" style="padding: 5px">unverified</span>
                  </td>
                  <td class="text-center">{{ item.created_at }}</td>
                  <td class="text-center bg-soft-primary">
                    <div class="flex align-items-center list-user-action">
                      <a class="btn btn-md btn-icon btn-info mx-1" data-bs-toggle="modal" data-bs-target="#modalEditUser" @click="editUser(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a class="btn btn-md btn-icon btn-danger mx-1" @click="deleteUser(item.id)">
                        <i class="ti ti-trash"></i>
                      </a>
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

  <div class="modal fade" id="modalAddUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">TAMBAH USER</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Nama</label>
              <input type="text" class="form-control" v-model="inputName" required="" />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Email</label>
              <input type="text" class="form-control" v-model="inputEmail" @input="validateEmail" />
            </div>
            <div class="col-12 mb-3">
              <label for="password" class="form-label">Password</label>
              <b-input-group size="md" class="mb-2">
                <b-form-input v-model="inputPassword" :type="showPassword ? 'text' : 'password'" class="form-control" id="password" aria-describedby="password"></b-form-input>
                <b-input-group-append is-text>
                  <b-form-checkbox switch class="mr-n2" @click="togglePasswordVisibility"> </b-form-checkbox>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Role</label>
              <select class="form-select" v-model="inputRole">
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer mt-4">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="validationAddUser()">Tambah</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modalEditUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT USER</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12 mb-3" style="display: none">
              <label class="form-label" for="validationDefault01">ID</label>
              <input type="text" class="form-control" v-model="user.id" disabled />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Nama</label>
              <input type="text" class="form-control" v-model="user.name" required="" />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Email</label>
              <input type="text" class="form-control" v-model="user.email" required="" />
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
            <div class="col-12 mb-3">
              <label class="form-label" for="validationDefault01">Role</label>
              <select class="form-select" v-model="user.role">
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
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
import { onMounted } from "vue"

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
      return this.userData.filter((user) => user.role !== "User" && Object.values(user).some((value) => value.toString().toLowerCase().includes(query)))
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

          const customSort = (a, b) => {
            if (a.role === "superadmin" && b.role !== "superadmin") {
              return -1
            } else if (a.role !== "superadmin" && b.role === "superadmin") {
              return 1
            } else {
              // Maintain the original order for other elements
              return 0
            }
          }

          this.userData.sort(customSort)

          console.log("💚 USERS FETCHED", this.userData)
        })
        .catch((error) => {
          console.error("💥 USERS ERROR :", error)
        })
    },

    async validationAddUser() {
      if (!this.inputName) {
        Swal.fire({
          icon: "error",
          title: "NAMA",
          text: "(tidak boleh kosong)",
          showConfirmButton: false,
          timer: 1500
        })
        return
      }

      if (!this.inputEmail) {
        Swal.fire({
          icon: "error",
          title: "EMAIL",
          text: "(tidak boleh kosong)",
          showConfirmButton: false,
          timer: 1500
        })
        return
      }

      if (!this.isEmailValid) {
        Swal.fire({
          icon: "error",
          title: "EMAIL",
          text: "(tidak valid)",
          showConfirmButton: false,
          timer: 1500
        })
        return
      }

      if (!this.inputPassword) {
        Swal.fire({
          icon: "error",
          title: "PASSWORD",
          text: "(tidak boleh kosong)",
          showConfirmButton: false,
          timer: 1500
        })
        return
      }

      if (!this.inputRole) {
        Swal.fire({
          icon: "error",
          title: "ROLE",
          text: "(tidak boleh kosong)",
          showConfirmButton: false,
          timer: 1500
        })
        return
      }

      this.addUser()
    },

    async addUser() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const addData = {
        name: this.inputName,
        email: this.inputEmail,
        password: this.inputPassword,
        role: this.inputRole
      }

      await axios
        .post("/api/v1/user/store", addData, config)
        .then((response) => {
          console.log("🚀 ADD USER SUCCESS", response)
          this.fetchUsers()

          Swal.fire({
            title: "Terimakasih!",
            text: "User telah berhasil ditambahkan 😊",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          })
        })
        .catch((error) => {
          console.error("💥 ADD USER FAILED:", error)

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
            text: "Email telah digunakan 😊"
          })
        })
    },

    async editUser(item) {
      this.user.id = item.id
      this.user.name = item.name
      this.user.email = item.email
      this.user.role = item.role
      this.user.password = item.password
    },

    async submitEdit() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      const updatedData = {
        id: parseInt(this.user.id),
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        password: this.user.password
      }

      localStorage.setItem("uname", this.user.name)

      await axios
        .put("/api/v1/user/update", updatedData, config)
        .then((response) => {
          console.log("🚀 UPDATE SUCCESS", response)
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
            text: "Input tidak boleh kosong! 😊"
          })
        })
    },

    async deleteUser(id) {
      console.log(id)

      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      Swal.fire({
        icon: "warning",
        title: "Yakin ingin menghapus?",
        text: "Data tidak akan bisa dikembalikan!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak"
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/v1/user/delete/${id}`, config)
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
                title: "User berhasil dihapus"
              })

              this.fetchUsers()

              console.log("💚 USER DELETED", response)
            })
            .catch((error) => {
              console.error("💥 DELETE USER FAILED :", error)
            })
        }
      })
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.isEmailValid = emailRegex.test(this.inputEmail)
    }
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
