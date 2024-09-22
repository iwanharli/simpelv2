<template>
  <!-- <loader-component :show="isLoader"></loader-component> -->

  <sidebar-component></sidebar-component>

  <main class="main-content" style="background: transparent !important;">
    <div :class="`position-relative  ${isBanner ? 'iq-banner ' + bannerStyle : ''}`">
      <header-component></header-component>
      <template v-if="isBanner">
        <sub-header></sub-header>
      </template>
    </div>

    <main-content-component>
      <router-view></router-view>
    </main-content-component>

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
