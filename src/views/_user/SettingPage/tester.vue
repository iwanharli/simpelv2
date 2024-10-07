<template>
  <div class="card-body p-0">
    <!-- Map Container -->
    <div id="mapv2" ref="mapv2" @ready="initializeMap"></div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"

export default {
  data() {
    return {
      map: null,
      mobileSettings: {},
      harbourCode: "",
      harbourName: "",
      appMode: "",
      appInterval: "",
      appRange: "",
      adminContact: "",
      appVersion: "",
      appUrl: "",

      polygonLabuh: [
        { long: "106.799515", lat: "-6.094641" },
        { long: "106.800150", lat: "-6.094497" },
        { long: "106.800705", lat: "-6.097516" },
        { long: "106.801459", lat: "-6.097383" },
        { long: "106.802173", lat: "-6.097260" },
        { long: "106.802246", lat: "-6.097981" },
        { long: "106.802041", lat: "-6.098020" },
        { long: "106.801833", lat: "-6.098059" },
        { long: "106.801823", lat: "-6.097996" },
        { long: "106.801803", lat: "-6.097895" },
        { long: "106.800773", lat: "-6.098092" },
        { long: "106.801052", lat: "-6.099740" },
        { long: "106.802173", lat: "-6.099532" },
        { long: "106.802591", lat: "-6.102103" },
        { long: "106.804187", lat: "-6.101823" },
        { long: "106.802908", lat: "-6.094972" },
        { long: "106.803074", lat: "-6.094610" },
        { long: "106.804399", lat: "-6.101957" },
        { long: "106.802454", lat: "-6.102295" },
        { long: "106.802025", lat: "-6.099767" },
        { long: "106.800907", lat: "-6.099951" },
        { long: "106.800569", lat: "-6.097961" },
        { long: "106.801896", lat: "-6.097703" },
        { long: "106.801927", lat: "-6.097885" },
        { long: "106.802047", lat: "-6.097862" },
        { long: "106.802012", lat: "-6.097500" },
        { long: "106.800553", lat: "-6.097762" },
        { long: "106.799995", lat: "-6.094720" },
        { long: "106.799802", lat: "-6.094763" },
        { long: "106.800151", lat: "-6.096540" },
        { long: "106.798911", lat: "-6.096732" },
        { long: "106.798863", lat: "-6.096481" },
        { long: "106.799850", lat: "-6.096326" }
      ],
      
      polygonTambat: [
        { long: "106.799515", lat: "-6.094641" },
        { long: "106.800150", lat: "-6.094497" },
        { long: "106.800705", lat: "-6.097516" },
        { long: "106.801459", lat: "-6.097383" },
        { long: "106.802173", lat: "-6.097260" },
        { long: "106.802246", lat: "-6.097981" },
        { long: "106.802041", lat: "-6.098020" },
        { long: "106.801833", lat: "-6.098059" },
        { long: "106.801823", lat: "-6.097996" },
        { long: "106.801803", lat: "-6.097895" },
        { long: "106.800773", lat: "-6.098092" },
        { long: "106.801052", lat: "-6.099740" },
        { long: "106.802173", lat: "-6.099532" },
        { long: "106.802591", lat: "-6.102103" },
        { long: "106.804187", lat: "-6.101823" },
        { long: "106.802908", lat: "-6.094972" },
        { long: "106.803074", lat: "-6.094610" },
        { long: "106.804399", lat: "-6.101957" },
        { long: "106.802454", lat: "-6.102295" },
        { long: "106.802025", lat: "-6.099767" },
        { long: "106.800907", lat: "-6.099951" },
        { long: "106.800569", lat: "-6.097961" },
        { long: "106.801896", lat: "-6.097703" },
        { long: "106.801927", lat: "-6.097885" },
        { long: "106.802047", lat: "-6.097862" },
        { long: "106.802012", lat: "-6.097500" },
        { long: "106.800553", lat: "-6.097762" },
        { long: "106.799995", lat: "-6.094720" },
        { long: "106.799802", lat: "-6.094763" },
        { long: "106.800151", lat: "-6.096540" },
        { long: "106.798911", lat: "-6.096732" },
        { long: "106.798863", lat: "-6.096481" },
        { long: "106.799850", lat: "-6.096326" }
      ],
      fixGeofenceLabuh: [],
      fixGeofenceTambat: [],

      transformedArray: []
    }
  },

  mounted() {
    this.getSettingApp()

    setTimeout(() => {
      this.initializeMap()
    }, 500)
  },

  methods: {
    async getSettingApp() {
      await axios
        .get("api/v1/setting/web", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          const appSetting = res.data.data

          this.harbourCode = appSetting.harbour_code
          this.harbourName = appSetting.harbour_name
          this.adminContact = appSetting.admin_contact
          this.appMode = appSetting.mode
          this.appInterval = appSetting.interval
          this.appRange = appSetting.range
          this.appVersion = appSetting.apk_min_version
          this.appUrl = appSetting.apk_min_download
          this.costMultiplier = appSetting.cost_multiplier
          this.dockingCost = appSetting.docking_cost
          this.polygonLabuh = appSetting.zone[1]

          // console.clear()
          console.log("GEOFENCE FETCHED", this.polygonLabuh)
        })
        .catch((error) => {
          setTimeout(this.getSettingApp, 1000)
          // console.error("Error: " + error.response.data.meta.message)
        })
    },

    async initializeMap() {
      let mapContainer = document.getElementById("mapv2")

      // Ensure the container exists before proceeding
      if (!mapContainer) {
        console.error("Map container not found!")
        return
      }

      // Clear existing map instance if exists
      if (this.mapInstance) {
        this.mapInstance.off() // Remove all event listeners
        this.mapInstance.remove() // Remove the map instance
        this.mapInstance = null // Reset map reference
      }

      // GEOFENCE Labuh
      this.fixGeofenceLabuh = this.polygonLabuh.map(({ lat, long }) => [parseFloat(lat), parseFloat(long)])

      // GEOFENCE Tambat
      this.fixGeofenceTambat = this.polygonTambat.map(({ lat, long }) => [parseFloat(lat), parseFloat(long)])

      const latlng = [-6.097643, 106.802428]

      // Initialize map with tiles and basic configurations
      const map = L.map(mapContainer, { preferCanvas: true, zoomControl: false })
        .setView(latlng, 17)
        .addLayer(
          // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          // https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
          L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            maxNativeZoom: 19,
            maxZoom: 30,
            minZoom: 10
          })
        )

      // Add zoom controls to the map
      L.control.zoom({ position: "topleft" }).addTo(map)

      // Animate map to the initial coordinates
      map.flyTo(latlng, 16, { duration: 1 })

      // Set map language and add controls for polygon drawing and editing
      map.pm.setLang("id")
      map.pm.addControls({
        position: "topright",
        drawPolygon: true,
        removalMode: true,
        editMode: true,
        drawText: true,
        cutPolygon: true,
        drawMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawCircleMarker: false
      })

      // First polygon polygonLabuh
      const polygonLabuh = L.polygon(this.fixGeofenceLabuh, {
        // pmIgnore: true,
        color: "blue",
        fillColor: "#A1B4FF",
        fillOpacity: 0.1
      }).addTo(map)

      // Second polygon polygonTambat (dummy)
      const polygonTambat = L.polygon(this.fixGeofenceTambat, {
        // pmIgnore: false,
        color: "yellow",
        fillColor: "yellow",
        fillOpacity: 0.1
      }).addTo(map)

      // Create an editable polygon layer group with both polygons______________________________________
      const editableLabuh = L.polygon(this.fixGeofenceLabuh, {
        color: "blue",
        fillColor: "#A1B4FF",
        fillOpacity: 0.5
      })

      const editableTambat = L.polygon(this.fixGeofenceTambat, {
        color: "yellow",
        fillColor: "yellow",
        fillOpacity: 0.5
      })

      const layerGroup = L.featureGroup([editableLabuh, editableTambat]).addTo(map)

      // Enable polygon editing
      layerGroup.pm.enable({ allowSelfIntersection: true })

      // ________________________________________________________HANDLING polygon changes
      const updateTransformedArray = (coords) => {
        this.transformedArray = coords.map(({ lat, lng }) => ({
          lat: `${lat}`,
          long: `${lng}`
        }))
      }

      // ________________________________________________________SAVE the updated coordinates
      const updatePolygonCoordinates = () => {
        // Labuh
        this.updatedPolygonLabuh = editableLabuh.getLatLngs()[0].map(({ lat, lng }) => ({
          lat: `${lat}`,
          long: `${lng}`
        }))

        // Tambat
        this.updatedPolygonTambat = editableTambat.getLatLngs()[0].map(({ lat, lng }) => ({
          lat: `${lat}`,
          long: `${lng}`
        }))

        console.log("Updated Labuh Coordinates:", this.updatedPolygonLabuh)
        console.log("Updated Tambat Coordinates:", this.updatedPolygonTambat)
      }

      // Handle map events: create, drag, remove, and cut polygons
      layerGroup.on({
        "pm:create": (e) => {
          console.log("Polygon Created:", e.layer._latlngs[0])
          updateTransformedArray(e.layer._latlngs[0])
        },
        "pm:cut": (e) => {
          console.log("Polygon Cut:", e.originalLayer._latlngs[0])
          updateTransformedArray(e.originalLayer._latlngs[0])
        },
        "pm:markerdragend": (e) => {
          // console.log("Marker Drag Ended:", e.layer._latlngs[0])
          // updateTransformedArray(e.layer._latlngs[0])
        },
        "pm:remove": (e) => {
          console.log("Polygon Removed:", e)
          updatePolygonCoordinates()
        },
        "pm:edit": (e) => {
          console.log("Polygon Edited", e)
          updatePolygonCoordinates() // Update coordinates after editing
        }
      })

      // Store references to polygons and map instance for later removal
      this.mapInstance = map
      this.polygonLabuh = polygonLabuh
      this.polygonTambat = polygonTambat
      this.editableLayerGroup = layerGroup
    }
  }
}
</script>

<style>
.card-body {
  position: relative;
  height: 100%; /* Make the card-body stretch to full height */
}

#mapv2 {
  height: 87vh;
  position: relative;
}

.map-buttons-container {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  /* justify-content: space-between; */
  background: #21252994;
  bottom: 0;
  left: 0;
  right: 0;
  gap: 100px;
  padding: 30px;
  border-radius: 20px 20px 0px 0px;
  z-index: 5000;
}

.btn-map-custom-edit {
  background: #3a57e8;
  width: 50%;
  height: 50%;
  border-radius: 20px;
  border: 3px solid white;
  color: white;
  font-weight: 600;
}

.btn-map-custom-edit:hover {
  background: #334dcc;
  color: white;
  border: 3px solid white;
}

.btn-map-custom-reset {
  background: #f16a1b;
  width: 50%;
  height: 50%;
  border-radius: 20px;
  border: 4px solid white;
  color: white;
  font-weight: 600;
}

.btn-map-custom-reset:hover {
  background: #cd5916;
  color: white;
  border: 4px solid white;
}

/* LOADING  */
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000ba;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
