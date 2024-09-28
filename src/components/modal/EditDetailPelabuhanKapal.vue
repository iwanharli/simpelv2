<template>
  <div class="modal fade" id="modalEditDetailPelabuhanKapal" aria-labelledby="modalToggleLabel" tabindex="-1" style="display: none">
    <div class="modal-dialog modal-md modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h4 class="modal-title text-white" style="font-weight: bold">EDIT PELABUHAN KAPAL</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateShipDetail">
            <div class="modal-body">
              <div class="row">
                <div class="col mb-4">
                  <label class="form-label" style="font-weight: bolder">Pelabuhan Pangkalan</label>
                  <input type="text" class="form-control" v-model="shipDetail.harbour" />
                </div>
              </div>
              <div class="row">
                <div class="col mb-4">
                  <label class="form-label" style="font-weight: bolder">Tanda Selar</label>
                  <input type="text" class="form-control" v-model="shipDetail.selar_mark" />
                </div>
              </div>
              <div class="row">
                <div class="col mb-4">
                  <button class="btn btn-primary d-grid w-100" type="submit">Simpan Perubahan</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"

export default {
  name: "ModalEditKapal",
  props: {
    onUpdateComplete: Function // for trigger parent method
  },
  data() {
    return {
      shipId: null,
      shipDetail: {
        harbour: "",
        selar_mark: ""
      }
    }
  },

  computed: {
    mergedDimensions() {
      const widthWithoutSpaces = this.shipDetail.width.toString().replace(/\s/g, "")
      const lengthWithoutSpaces = this.shipDetail.length.toString().replace(/\s/g, "")

      return `${widthWithoutSpaces} X ${lengthWithoutSpaces}`
    }
  },

  mounted() {
    this.shipId = this.$route.params.shipId
    this.getShipDetail(this.shipId)
  },

  methods: {
    getShipDetail(shipId) {
      axios
        .get(`/api/v1/ship/detail/${shipId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then((res) => {
          const shipData = res.data.data
          const shipDetail = res.data.data.detail

          // MERGE SHIP & SHIP DETAIL
          this.shipDetail = {
            ...shipData,
            ...shipDetail
          }

          // console.log(">", this.shipDetail.device_id)

          // If exists
          if (shipDetail.dimension) {
            const [width, length] = shipDetail.dimension.split("X").map((value) => value.trim().replace(",", "."))

            this.shipDetail.width = parseFloat(width)
            this.shipDetail.length = parseFloat(length)
          }
        })
        .catch((error) => {
          console.error("Error fetching ship details:", error)
        })
    },

    // Update ship details
    async updateShipDetail() {
      const url = `/api/v1/ship/update-detail`

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer
          toast.onmouseleave = Swal.resumeTimer
        }
      })

      // Prepare for update
      const dataToUpdate = {
        ship_id: this.shipDetail.id,
        ship_name: this.shipDetail.ship_name,
        owner_name: this.shipDetail.owner_name,
        responsible_name: this.shipDetail.responsible_name,
        type: this.shipDetail.type,
        dimension: this.mergedDimensions,
        gt: this.shipDetail.gt,
        iot_phone: this.shipDetail.iot_phone,
        device_id: this.shipDetail.device_id,
        harbour: this.shipDetail.harbour,
        selar_mark: this.shipDetail.selar_mark,
        siup: this.shipDetail.siup,
        bkp: this.shipDetail.bkp,
      }

      // console.log(dataToUpdate)

      try {
        const res = await axios.put(url, dataToUpdate, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })

        if (res.status === 200) {
          Toast.fire({
            icon: "success",
            title: "Berhasil Update Data"
          })

          // Call the parent's method directly using the prop
          this.onUpdateComplete(this.shipDetail.id)
          $("#modalEditDetailPelabuhanKapal").modal("hide")
        }
      } catch (error) {
        console.error("Error updating ship details:", error)

        Toast.fire({
          icon: "error",
          title: "Gagal Update Data"
        })
      }
    },

    // STYLING
    formatShipStatus(status) {
      if (status) {
        return status.toUpperCase()
      } else {
        return ""
      }
    }
  }
}
</script>
