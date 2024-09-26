<template>
  <!-- <loader-component :show="isLoader"></loader-component> -->

  <sidebar-component></sidebar-component>

  <main class="main-content" style="background: transparent !important">
    <div :class="`position-relative  ${isBanner ? 'iq-banner ' + bannerStyle : ''}`">
      <header-component></header-component>
      <template v-if="isBanner">
        <sub-header></sub-header>
      </template>
    </div>

    <main-content-component>
      <div style="padding: 0px !important">
        <!-- <div style="height: 100vh; width: 100%; background: #00000054; position: absolute; left: 0"> -->
        <!-- <map-dashboard-3> -->
        <router-view></router-view>
        <!-- </map-dashboard-3> -->
        <!-- </div> -->
      </div>
    </main-content-component>

    <div class="navbarBottom p-3">
      <div class="button-group">
        <button class="btn btn-lg btn-primary rounded-5 me-2">Button 1</button>
        <button class="btn btn-lg btn-warning rounded-5">Button 2</button>
      </div>
    </div>

    <!-- <footer-component></footer-component> -->
  </main>

  <setting-offcanvas></setting-offcanvas>
</template>

<script setup>
// Library
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"

// Components
import SidebarComponent from "@/components/partials/SidebarComponent.vue"
import HeaderComponent from "@/components/partials/HeaderComponent.vue"
import SubHeader from "@/components/partials/SubHeader.vue"
import MainContentComponent from "@/components/partials/MainContentComponent.vue"
import SettingOffcanvas from "@/components/partials/setting/SettingOffcanvas.vue"
import LoaderComponent from "@/components/partials/LoaderComponent.vue"
import FooterComponent from "@/components/partials/FooterComponent.vue"
import MapDashboard3 from "@/components/map/MapDashboard3.vue"

const route = useRoute()
const store = useStore()
const isBanner = computed(() => route.meta.isBanner)
const bannerStyle = computed(() => store.getters["setting/header_banner"])
const isLoader = ref(true)

// onMounted(() => {
//   setTimeout(() => {
//     isLoader.value = false
//   }, 300)
// })
</script>

<style scoped>
.navbarBottom {
  position: absolute;
  right: 0;
  bottom: 30px;
  width: 20%;
  height: 100px;
  border-radius: 50px 0px 0px 50px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  z-index: 9999;
}

.button-group {
  display: flex;
  justify-content: left;
  height: 100%;
}
</style>
