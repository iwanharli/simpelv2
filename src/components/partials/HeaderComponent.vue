<template>
  <default-navbar :isGoPro="true" :isSearch="true">
    <div class="sidebar-toggle" data-toggle="sidebar" data-active="true" @click="toggleSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-baseline-density-medium">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 20h16" />
        <path d="M4 12h16" />
        <path d="M4 4h16" />
      </svg>

      <!-- <i class="ti ti-checks me-xs-1"></i> -->
      <!-- <i class="icon d-flex">
        <svg width="20px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
        </svg>
      </i> -->
    </div>
  </default-navbar>
</template>
<script>
import { computed, ref, onMounted, onUnmounted } from "vue"
import { useStore } from "vuex"
import DefaultNavbar from "@/components/partials/custom/DefaultNavbar.vue"
export default {
  components: {
    DefaultNavbar
  },
  setup() {
    const store = useStore()
    const carts = computed(() => store.getters.carts)
    const headerNavbar = computed(() => store.getters["setting/header_navbar"])
    const sidebarType = computed(() => store.getters["setting/sidebar_type"])
    const themeSchemeDirection = computed(() => store.getters["setting/theme_scheme_direction"])
    const fullScreen = ref(false)
    const isHidden = ref(false)

    const openFullScreen = () => {
      if (fullScreen.value) {
        fullScreen.value = false
        document.exitFullscreen()
      } else {
        fullScreen.value = true
        document.documentElement.requestFullscreen()
      }
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

    const toggleSidebar = () => {
      // Code Here
      if (sidebarType.value.includes("sidebar-mini")) {
        store.dispatch(
          "setting/sidebar_type",
          sidebarType.value.filter((item) => item !== "sidebar-mini")
        )
      } else {
        store.dispatch("setting/sidebar_type", [...sidebarType.value, "sidebar-mini"])
      }
    }

    onMounted(() => {
      window.addEventListener("scroll", onscroll())
    })

    onUnmounted(() => {
      window.removeEventListener("scroll", onscroll())
    })

    const updateRadio = (size) => {
      store.dispatch("setting/theme_font_size", size)
    }
    return {
      headerNavbar,
      openFullScreen,
      updateRadio,
      toggleSidebar,
      fullScreen,
      isHidden,
      carts,
      themeSchemeDirection
    }
  },
  props: {
    fullsidebar: { type: Boolean, default: false }
  }
}
</script>
<style>
.iq-product-menu-responsive .offcanvas-header {
  display: none;
}
</style>
