<template>
  <aside id="first-tour" :class="`sidebar sidebar-base ${sidebarColor} ${sidebarMenuStyle} ${sidebarType.join(' ')}`" data-toggle="main-sidebar" data-sidebar="responsive" style="z-index: 2000 !important">
    <div class="sidebar-header d-flex align-items-center justify-content-start">
      <router-link :to="{ name: 'admin.dashboard' }" class="navbar-brand" style="margin-left: 5px">
        <img class="logo" src="@/assets/app/s-logo.svg" />
        <div class="logo-title">
          <h4 class="title mt-1" style="">IMPEL</h4>
          <span class="subtitle">V2</span>
        </div>
      </router-link>
      <div class="sidebar-toggle" @click="toggleSidebar">
        <i class="icon-custom p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-baseline-density-medium">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 20h16" />
            <path d="M4 12h16" />
            <path d="M4 4h16" />
          </svg>
        </i>
      </div>
    </div>
    <div class="sidebar-body pt-0 data-scrollbar">
      <slot name="profile-card"></slot>
      <div class="sidebar-list">
        <slot></slot>
      </div>
    </div>
    <div class="sidebar-footer"></div>
  </aside>
</template>

<script>
import { useStore } from "vuex"
import { onMounted, computed } from "vue"
import Scrollbar from "smooth-scrollbar"

export default {
  setup() {
    const store = useStore()
    const sidebarColor = computed(() => store.getters["setting/sidebar_color"])
    const sidebarType = computed(() => store.getters["setting/sidebar_type"])
    const sidebarMenuStyle = computed(() => store.getters["setting/sidebar_menu_style"])
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
      Scrollbar.init(document.querySelector(".data-scrollbar"), { continuousScrolling: false })
    })
    return { sidebarColor, sidebarType, sidebarMenuStyle, toggleSidebar }
  }
}
</script>

<style>
.sidebar-header {
  background: #2b397e;
  /* border-radius: 20px; */
}

.sidebar-header img {
  width: 37px;
  height: 37px;
}

.sidebar-header .logo-title {
  display: flex;
  align-items: center;
}

.logo {
  padding: 1px;
  background: #ffffff;
  border-radius: 11px;
}

.title {
  font-weight: bolder;
  margin-right: 1px;
  margin-left: -7px;
  letter-spacing: 3px;
}

.title,
.subtitle {
  color: white !important;
}

/* .sidebar {
  background: #328dae;
  border-right: 5px solid #c7d0ff7a;
}

.logo-title span {
  color: white;
}

.default-icon {
  color: rgba(255, 255, 255, 0.536) !important;
}

.item-name {
  color: white;
}

.nav-item:hover {
  .item-name {
    color: #3a57e8;
  }
}

.nav-item.active:hover {
  .icon {
    color: white !important;
  }

  .item-name {
    color: white !important;
  }

  .nav-item:hover {
    .item-name {
      color: #3a57e8 !important;
    }
  }

  .nav-link.active:hover {
    .item-name {
      color: white !important;
    }
  }

  .sidebar-base .nav-item .icon {
    color: #3a57e8 !important;
  }
}

.nav-link:hover {
  .sidebar-base .nav-item .nav-link:not(.disabled) .icon {
    color: #000000 !important;
  }
} */
</style>
