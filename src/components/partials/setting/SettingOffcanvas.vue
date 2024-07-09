<template>
  <!-- <b-offcanvas v-model="show" :backdrop="true" title="Ubah Tema" :placement="themeSchemeDirection !== 'ltr' ? 'start' : 'end'" class="live-customizer" id="live-customizer" :body-scrolling="true">
    <div class="row">
      <div class="col-lg-12">
        <div>
          <div>
            <theme-scheme />
            <color-customizer />
          </div>
          <hr class="hr-horizontal" />
          <menu-color v-if="isShowSetting('isSidebar')" />
          <hr class="hr-horizontal" />
          <menu-style v-if="isShowSetting('isSidebar')" />
          <hr class="hr-horizontal" />
          <menu-active-style v-if="isShowSetting('isSidebar')" />
          <hr class="hr-horizontal" />
          <navbar-style v-if="isShowSetting('isNavbar')" />
        </div>
      </div>
    </div>
  </b-offcanvas> -->

  <a class="btn btn-fixed-end btn-secondary btn-icon btn-setting" data-bs-toggle="modal" data-bs-target="#modalChangeColor" style="border-radius: 20px 0px 0px 20px; border: 2px solid white">
    <div class="animated-rotate" style="font-size: 22px">🐋</div>
  </a>

  <div class="modal fade" id="modalChangeColor" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">UBAH WARNA</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <color-customizer />
        </div>
      </div>
    </div>
  </div>
  <!-- Settings sidebar end here -->
</template>
<script>
// Vue / Vuex Functions
import { ref, onMounted, onUnmounted, computed, watch } from "vue"
import { useStore } from "vuex"
import { useRoute } from "vue-router"

// Style Components
import ColorCustomizer from "@/components/partials/setting/canvas/ColorCustomizer.vue"
import ThemeScheme from "@/components/partials/setting/canvas/ThemeScheme.vue"
import MenuColor from "@/components/partials/setting/canvas/MenuColor.vue"
import MenuStyle from "@/components/partials/setting/canvas/MenuStyle.vue"
import MenuActiveStyle from "@/components/partials/setting/canvas/MenuActiveStyle.vue"
import NavbarStyle from "@/components/partials/setting/canvas/NavbarStyle.vue"

// Utilities
import { copyToClipboard } from "@/utilities/dom"
export default {
  name: "SettingOffcanvas",
  components: {
    // Style Components
    ThemeScheme,
    MenuColor,
    MenuStyle,
    MenuActiveStyle,
    NavbarStyle,
    ColorCustomizer
  },
  setup() {
    // Store objects
    const store = useStore()
    const route = useRoute()
    const themeSchemeDirection = computed(() => store.getters["setting/theme_scheme_direction"])

    // Variables
    const show = ref(false)

    // Functions
    const close = () => {
      show.value = false
    }
    const open = () => {
      show.value = true
    }
    const onClick = (e) => {
      if (show.value) {
        if (e.target.closest(".live-customizer") == null && e.target.closest("#settingbutton") == null) {
          show.value = false
        }
      }
    }
    const copyConfig = () => {
      copyToClipboard(store.state.setting)
    }
    const defaultSetting = () => {
      store.dispatch("setting/reset_state")
    }
    const isShowSetting = (name) => {
      return !route.meta[name]
    }

    // Life cycle hooks
    watch(themeSchemeDirection, () => {
      show.value = false
    })
    onMounted(() => {
      document.body.addEventListener("click", onClick)
    })
    onUnmounted(() => {
      document.body.removeEventListener("click", onClick)
    })

    // Return functions & variables
    return {
      themeSchemeDirection,
      show,
      isShowSetting,
      copyConfig,
      defaultSetting,
      close,
      open
    }
  }
}
</script>
<style>
.live-customizer .offcanvas-title {
  font-size: calc(1.269rem + 0.228vw);
  flex: 1;
}
@media (min-width: 1200px) {
  .live-customizer .offcanvas-title {
    font-size: 1.44rem;
  }
}
</style>
