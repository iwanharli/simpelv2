<template>
  <default-sidebar>
    <ul class="navbar-nav iq-main-menu" id="sidebar-menu">
      <side-menu title="HOME" :static-item="true"></side-menu>
      <side-menu title="DASHBOARD" isTag="router-link" icon="view-grid" :route="{ to: 'admin.dashboard' }" style="font-weight: bolder"></side-menu>

      <br />
      <li><hr class="hr-horizontal" /></li>
      <side-menu title="MANAJEMEN" :static-item="true" miniTitle=""></side-menu>

      <side-menu title="KAPAL" isTag="router-link" icon="location" :route="{ to: 'admin.ship' }" style="font-weight: bolder"></side-menu>

      <side-menu title="KEDATANGAN" isTag="router-link" icon="filter" :route="{ to: 'admin.arrival' }" style="font-weight: bolder"></side-menu>

      <side-menu title="PENGAJUAN" icon="document" :caret-icon="true" :route="{ popup: 'false', to: 'approval' }" @onClick="toggle" :active="currentRoute.includes('approval')" style="font-weight: bolder">
        <b-collapse tag="ul" class="sub-nav" id="approval" accordion="sidebar-menu" :visible="currentRoute.includes('approval')">
          <side-menu title="Disetujui" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="D" :route="{ to: 'admin.approval-accepted' }"></side-menu>
          <side-menu title="Pending" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="P" :route="{ to: 'admin.approval-pending' }"></side-menu>
          <side-menu title="Ditolak" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="X" :route="{ to: 'admin.approval-rejected' }"></side-menu>
        </b-collapse>
      </side-menu>

      <side-menu title="LAPORAN" icon="file" :caret-icon="true" :route="{ popup: 'false', to: 'report' }" @onClick="toggle" :active="currentRoute.includes('report')" style="font-weight: bolder">
        <b-collapse tag="ul" class="sub-nav" id="report" accordion="sidebar-menu" :visible="currentRoute.includes('report')">
          <side-menu title="Labuh" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="L" :route="{ to: 'admin.report-docking' }"></side-menu>
          <side-menu title="Fraud" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="F" :route="{ to: 'admin.report-fraud' }"></side-menu>
        </b-collapse>
      </side-menu>

      <side-menu title="PENGGUNA" icon="user-group" :caret-icon="true" :route="{ popup: 'false', to: 'user' }" @onClick="toggle" :active="currentRoute.includes('user')" style="font-weight: bolder" v-if="userRole === 'superadmin'">
        <b-collapse tag="ul" class="sub-nav" id="user" accordion="sidebar-menu" :visible="currentRoute.includes('user')">
          <side-menu title="Web" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="W" :route="{ to: 'admin.user-web' }"></side-menu>
          <side-menu title="Mobile" isTag="router-link" icon="circle" :icon-size="15" icon-type="solid" miniTitle="M" :route="{ to: 'admin.user-mobile' }"></side-menu>
        </b-collapse>
      </side-menu>

      <br />
      <br />
      <li><hr class="hr-horizontal" /></li>
      <side-menu title="LAINNYA" :static-item="true"></side-menu>
      <side-menu title="PENGATURAN" icon="setting" :caret-icon="true" :route="{ popup: 'false', to: 'setting' }" @onClick="toggle" :active="currentRoute.includes('setting')" style="font-weight: bolder" v-if="userRole === 'superadmin'">
        <b-collapse tag="ul" class="sub-nav" id="setting" accordion="sidebar-menu" :visible="currentRoute.includes('setting')">
          <side-menu isTag="router-link" title="Perangkat" icon="circle" :icon-size="10" icon-type="solid" miniTitle="L" :route="{ to: 'admin.setting-application' }"></side-menu>
          <side-menu isTag="router-link" title="Map Geofence" icon="circle" :icon-size="10" icon-type="solid" miniTitle="R" :route="{ to: 'admin.setting-geofence-nizamZachman' }"></side-menu>
          <!-- <side-menu isTag="router-link" title="Map Nizam Zachman" icon="circle" :icon-size="10" icon-type="solid" miniTitle="N" :route="{ to: 'admin.setting-geofence-nizamZachman' }"></side-menu> -->
        </b-collapse>
      </side-menu>

      <!-- ADMIN  -->
      <side-menu title="PENGGUNA" isTag="router-link" icon="user-group" :route="{ to: 'admin.user-mobile' }" style="font-weight: bolder" v-if="userRole === 'admin'"></side-menu>

      <side-menu title="PENGATURAN" isTag="router-link" icon="setting" :route="{ to: 'admin.setting-application' }" style="font-weight: bolder" v-if="userRole === 'admin'"></side-menu>

      <br />
    </ul>
  </default-sidebar>
</template>

<script setup>
import DefaultSidebar from "@/components/partials/custom/DefaultSidebar.vue"
import SideMenu from "@/components/partials/custom/SideMenu.vue"

import { ref, computed } from "vue"
import { useRoute } from "vue-router"

const currentRoute = ref("")
const route = useRoute()
const notificationCount = ref(0)
const config = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }

const userRole = computed(() => localStorage.getItem("urole"))

const toggle = (route) => {
  if (route === currentRoute.value && route.includes(".")) {
    const menu = currentRoute.value.split(".")
    return (currentRoute.value = menu[menu.length - 2])
  }
  if (route !== currentRoute.value && currentRoute.value.includes(route)) {
    return (currentRoute.value = "")
  }
  if (route !== currentRoute.value) {
    return (currentRoute.value = route)
  }
  if (route === currentRoute.value) {
    return (currentRoute.value = "")
  }

  return (currentRoute.value = "")
}

toggle(route.name)
</script>

<style>
.badge {
  background-color: red;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
}
</style>
