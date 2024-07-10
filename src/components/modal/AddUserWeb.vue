<template>
  <div class="modal fade" id="modalAddUser" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">TAMBAH USER</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close')"></button>
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
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import AOS from "aos"
import { onMounted } from "vue"
// import modal from "@/com"

export default {
  name: "ModalAddUser",
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

  // components: {
  //   modalAddUser,
  //   modalEditUser
  // },

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
      // this.user.password = item.password
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
