<template>
  <!-- <nav :class="`nav navbar navbar-expand-xl navbar-light iq-navbar ${headerNavbar} ${navbarHide.join('')}`"> -->
  <nav :class="`nav navbar navbar-expand-md navbar-light iq-navbar ${headerNavbar}`" :style="{ left: NavbarLeft, background: NavbarBackground }">
    <div class="container-fluid navbar-inner">
      <slot></slot>
      <div></div>

      <!-- LOGO  -->
      <div class="navbar-brand">
        <!-- <img src="@/assets/app/s-logo.svg" style="width: 50px; height: 50px" /> -->
      </div>

      <div id="navbarSupportedContent">
        <ul class="mb-2 navbar-nav ms-auto align-items-center navbar-list mb-lg-0">
          <!-- DARK MODE  -->
          <li class="nav-item dropdown mobile-navbar" style="display: flex; align-items: center; justify-content: center; margin-right: 50px; display: none">
            <input class="darkmode" id="darkmode-toggle" type="checkbox" v-model="isDarkMode" @change="updateDarkMode" />
            <label class="darkmode" for="darkmode-toggle">
              <svg version="1.1" class="sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 496 496" style="enable-background: new 0 0 496 496" xml:space="preserve">
                <rect x="152.994" y="58.921" transform="matrix(0.3827 0.9239 -0.9239 0.3827 168.6176 -118.5145)" width="40.001" height="16" />
                <rect x="46.9" y="164.979" transform="matrix(0.9239 0.3827 -0.3827 0.9239 71.29 -12.4346)" width="40.001" height="16" />
                <rect x="46.947" y="315.048" transform="matrix(0.9239 -0.3827 0.3827 0.9239 -118.531 50.2116)" width="40.001" height="16" />

                <rect x="164.966" y="409.112" transform="matrix(-0.9238 -0.3828 0.3828 -0.9238 168.4872 891.7491)" width="16" height="39.999" />

                <rect x="303.031" y="421.036" transform="matrix(-0.3827 -0.9239 0.9239 -0.3827 50.2758 891.6655)" width="40.001" height="16" />

                <rect x="409.088" y="315.018" transform="matrix(-0.9239 -0.3827 0.3827 -0.9239 701.898 785.6559)" width="40.001" height="16" />

                <rect x="409.054" y="165.011" transform="matrix(-0.9239 0.3827 -0.3827 -0.9239 891.6585 168.6574)" width="40.001" height="16" />
                <rect x="315.001" y="46.895" transform="matrix(0.9238 0.3828 -0.3828 0.9238 50.212 -118.5529)" width="16" height="39.999" />
                <path
                  d="M248,88c-88.224,0-160,71.776-160,160s71.776,160,160,160s160-71.776,160-160S336.224,88,248,88z M248,392
				c-79.4,0-144-64.6-144-144s64.6-144,144-144s144,64.6,144,144S327.4,392,248,392z"
                />
                <rect x="240" width="16" height="72" />
                <rect x="62.097" y="90.096" transform="matrix(0.7071 0.7071 -0.7071 0.7071 98.0963 -40.6334)" width="71.999" height="16" />
                <rect y="240" width="72" height="16" />

                <rect x="90.091" y="361.915" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -113.9157 748.643)" width="16" height="71.999" />
                <rect x="240" y="424" width="16" height="72" />

                <rect x="361.881" y="389.915" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 397.8562 960.6281)" width="71.999" height="16" />
                <rect x="424" y="240" width="72" height="16" />
                <rect x="389.911" y="62.091" transform="matrix(0.7071 0.7071 -0.7071 0.7071 185.9067 -252.6357)" width="16" height="71.999" />
              </svg>

              <svg version="1.1" class="moon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 49.739 49.739" style="enable-background: new 0 0 49.739 49.739" xml:space="preserve">
                <path
                  d="M25.068,48.889c-9.173,0-18.017-5.06-22.396-13.804C-3.373,23.008,1.164,8.467,13.003,1.979l2.061-1.129l-0.615,2.268
       c-1.479,5.459-0.899,11.25,1.633,16.306c2.75,5.493,7.476,9.587,13.305,11.526c5.831,1.939,12.065,1.492,17.559-1.258v0
       c0.25-0.125,0.492-0.258,0.734-0.391l2.061-1.13l-0.585,2.252c-1.863,6.873-6.577,12.639-12.933,15.822
       C32.639,48.039,28.825,48.888,25.068,48.889z M12.002,4.936c-9.413,6.428-12.756,18.837-7.54,29.253
       c5.678,11.34,19.522,15.945,30.864,10.268c5.154-2.582,9.136-7.012,11.181-12.357c-5.632,2.427-11.882,2.702-17.752,0.748
       c-6.337-2.108-11.473-6.557-14.463-12.528C11.899,15.541,11.11,10.16,12.002,4.936z"
                />
              </svg>
            </label>
          </li>

          <!-- NOTIFICATION  -->
          <li class="nav-item dropdown mobile-navbar notif-custom bg-soft-secondary" style="margin-right: 20px; border-radius: 50px">
            <!-- ICON LONCENG  -->
            <a href="#" class="nav-link" id="notification-drop" data-bs-toggle="dropdown">
              <icon-component type="dual-tone" icon-name="bell" class="icon-bell"></icon-component>
              <span class="notification-count" v-if="totalCount !== null">{{ this.totalCount }}</span>
            </a>

            <!-- NOTIF BODY  -->
            <div class="p-0 sub-drop dropdown-menu dropdown-menu-end" style="width: 230px" aria-labelledby="notification-drop">
              <b-card no-body class="m-0 shadow-none" style="border-radius: 10px 10px 0px 0px">
                <div class="d-flex align-items-center justify-content-center bg-warning text-center" style="padding: 10px 5px 10px 5px; border-radius: 10px 10px 0px 0px">
                  <h6 class="mb-0 text-white" style="font-weight: bold; cursor: default">SEMUA NOTIFIKASI</h6>
                </div>

                <b-card-body class="p-0">
                  <a href="#" class="iq-sub-card" v-for="item in inspeksiData" :key="item.log_id">
                    <RouterLink :to="{ name: 'admin.arrival' }">
                      <div class="d-flex align-items-center">
                        <div class="ms-3 w-100">
                          <div class="d-flex align-items-center">
                            <h6 class="mb-0">{{ item.ship_name }}</h6>
                          </div>
                          <div>
                            <span class="badge bg-info ml-2">
                              INSPEKSI
                              <span class="circle-notification" style="background-color: green" v-if="item.is_inspected === 1"></span>
                              <span class="circle-notification" style="background-color: red" v-else></span>
                            </span>
                            &nbsp;
                            <span class="badge bg-info ml-2">
                              REPORT
                              <span class="circle-notification" style="background-color: green" v-if="item.is_inspected === 1"></span>
                              <span class="circle-notification" style="background-color: red" v-else></span>
                            </span>
                          </div>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="float-end font-size-12">{{ item.checkin_date }}</small>
                          </div>
                        </div>
                      </div>
                    </RouterLink>
                  </a>

                  <a href="#" class="iq-sub-card p-0">
                    <RouterLink :to="{ name: 'admin.approval-pending' }">
                      <div class="w-100">
                        <div class="d-flex align-items-center justify-content-center">
                          <h6 class="mb-0">{{ this.pendingCount }} KAPAL</h6>
                          &nbsp;&nbsp;
                          <span class="badge bg-warning text-dark">PENDING</span>
                        </div>
                      </div>
                    </RouterLink>
                  </a>
                </b-card-body>
              </b-card>
            </div>
          </li>

          <!-- USER PROFILE  -->
          <li class="nav-item dropdown user-profile-custom">
            <a class="nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="@/assets/images/user2.png" alt="User-Profile" class="img-fluid avatar avatar-50 avatar-rounded" />
              <div class="caption ms-3 d-none d-md-block">
                <h6 class="caption-title mb-1" style="font-weight: bolder; text-transform: capitalize">{{ uname }}</h6>
                <small class="caption-sub-title mb-0 mt-0" :class="{ 'bg-danger': urole === 'superadmin', 'bg-info': urole === 'admin' }" style="text-transform: uppercase; border-radius: 5px; color: white; padding: 5px; font-size: 12px">
                  {{ urole }}
                </small>
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="navbarDropdown">
              <!-- <li><router-link class="dropdown-item" :to="{ name: 'admin.dashboard' }">Profile</router-link></li>
              <li><hr class="dropdown-divider" /></li> -->
              <li class="custom-profile bg-primary mb-1" style="border-radius: 10px">
                <a href="#" class="dropdown-item logout text-white" style="font-weight: bolder; padding: 10px" @click="logout()">Profil</a>
              </li>
              <li class="custom-logout bg-danger" style="border-radius: 10px">
                <a href="#" class="dropdown-item logout text-white" style="font-weight: bolder; padding: 10px" @click="logout()">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from "vue"
import { useStore } from "vuex"
import axios from "axios"

export default {
  data() {
    return {
      inspeksiData: [],
      pendingData: [],

      inspeksiCount: 0,
      pendingCount: 0,
      totalCount: null
    }
  },

  props: {
    isGoPro: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore()
    const headerNavbar = computed(() => store.getters["setting/header_navbar"])
    const isHidden = ref(false)

    const isDarkMode = ref(store.getters["setting/theme_scheme"] === "dark") // Start with "Dark" mode initially

    const carts = computed(() => store.getters.carts)

    const updateDarkMode = () => {
      const value = isDarkMode.value ? "dark" : "light"
      store.dispatch("setting/theme_scheme", value)
    }

    const onscroll = () => {
      const yOffset = document.documentElement.scrollTop
      const navbar = document.querySelector(".navs-sticky")
      if (navbar !== null) {
        if (yOffset >= 100) {
          navbar.classList.add("menu-sticky")
        } else {
          navbar.classList.remove("menu-sticky")
        }
      }
    }

    onMounted(() => {
      window.addEventListener("scroll", onscroll())
    })

    onUnmounted(() => {
      window.removeEventListener("scroll", onscroll())
    })

    return {
      headerNavbar,
      isHidden,
      carts,
      emit,
      isDarkMode,
      updateDarkMode,
      uname: localStorage.getItem("uname"),
      urole: localStorage.getItem("urole")
    }
  },

  mounted() {
    this.fetchNotif()

    this.notificationInterval = setInterval(() => {
      this.fetchNotif()
    }, 10 * 60 * 1000)
  },

  computed: {
    NavbarLeft() {
      if (this.$route.name === "admin.dashboard") {
        return "7%"
      } else if (this.$route.name === "admin.setting-geofence-nizamZachman") {
        return "7%"
      }
      return "78%" // Default value
    },

    NavbarBackground() {
      if (this.$route.name === "admin.dashboard") {
        return "rgba(255, 255, 255, 0.3)"
      } else if (this.$route.name === "admin.setting-geofence-nizamZachman") {
        return "rgba(255, 255, 255, 0.3)"
      }
      return "white" // Default value
    }
  },

  methods: {
    async fetchNotif() {
      const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

      try {
        // Inspeksi request
        const response1 = await axios.get("/api/v1/inspection/", config)
        this.inspeksiData = response1.data.data || []
        this.inspeksiCount = this.inspeksiData.length

        // Pending request
        const response2 = await axios.get("/api/v1/ship/pairing-request", config)
        this.pendingData = response2.data.data || []
        this.pendingData = this.pendingData.filter((item) => item.status === "pending")

        this.pendingCount = this.pendingData.length

        // Update total count
        this.totalCount = this.inspeksiCount + this.pendingCount

        console.log(`💚 NOTIF UPDATED > ${this.totalCount} at ${new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}`)
      } catch (error) {
        console.error(" 💥 ERROR NOTIF:", error)
      }
    },

    logout() {
      localStorage.clear()
      this.$router.push({ name: "auth.login" })
      console.log("💀 SESSION REMOVED")
    }
  },

  beforeUnmount() {
    clearInterval(this.notificationInterval)
  }
}
</script>

<style>
nav.navbar {
  transition: left 1s ease, background 1s ease;
  position: absolute !important;
  top: 20px;
  right: 20px;
  border-radius: 50px 20px 20px 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

.nav .navbar-inner {
  padding: 0 !important;
  padding-left: 20px !important;
  padding-right: 10px !important;
}

.nav-link {
  border-radius: 1.25rem !important;
}

.iq-navbar .dropdown .dropdown-menu[data-bs-popper] {
  background: #aadbfc;
  padding: 5px !important;
}

.dropdown-menu {
  /* border: 3px solid white; */
  top: 100%;
  border-radius: 10px;
}

.dropdown-item {
  border-radius: 30px;
}

.nav-item.dropdown.user-profile-custom {
  padding: 5px;
}

.nav-item.dropdown.user-profile-custom:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  border-radius: 10px;
}

.custom-profile:hover {
  background: #2a41b3 !important;
}

.custom-logout:hover {
  background: #882217 !important;
}

.notif-custom:hover {
  background: rgba(128, 128, 128, 0.278) !important;

  .icon-bell {
    color: black !important;
  }
}

.circle-notification {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: inline-block;
  border: 1px solid black;
}

.notification-count {
  background-color: #d45d5d; /* Set the background color */
  color: #ffffff; /* Set the text color */
  font-size: 12px; /* Set the font size */
  padding: 3px 6px; /* Set padding for better appearance */
  border-radius: 50%; /* Make it a circle-notification using border-radius */
  margin-left: 5px; /* Adjust spacing from the bell icon */
}

@keyframes bellAnimation {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.icon-bell {
  animation: bellAnimation 0.5s ease-in-out infinite;
}

@media only screen and (max-width: 769px) {
  .mobile-navbar {
    display: none !important;
  }
}
</style>
