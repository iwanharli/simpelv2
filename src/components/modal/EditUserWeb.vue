<template>
  <div class="modal fade" id="modalEditUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT USERS</h4>
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
              <input type="text" class="form-control" v-model="this.user.name" required="" />
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
  props: {
    item: {
      type: Object
    }
  },

  data() {
    return {
      showPassword: false,
      searchQuery: "",

      UserId: "",

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
    this.userId = this.$route.params.userId
    console.log(this.userId)

    this.fetchUsers(this.userId)
  },

  methods: {
    fetchUsers(userId) {
      console.log(userId)

      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      axios
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
