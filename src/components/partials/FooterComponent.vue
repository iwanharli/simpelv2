<template>
  <!-- Footer Section Start -->
  <footer :class="`footer ${footerStyle}`">
    <div class="footer-body">
      <ul class="left-panel list-inline mb-0 p-0">
        <li class="list-inline-item">Privacy Policy</li>
        <li class="list-inline-item">Terms of Use</li>
      </ul>
      <div class="right-panel">©2023, Made by <a href="#">SIMPEL</a>.</div>
    </div>
  </footer>
  <!-- Footer Section End -->
  <b-offcanvas v-model="shareOffcanvas" @hide="hideShareOffcanvas" placement="bottom" title="Share">
    <share-offcanvas></share-offcanvas>
  </b-offcanvas>
</template>

<script>
import { computed, watch, ref } from "vue"
import { useStore } from "vuex"
import ShareOffcanvas from "@/components/partials/setting/ShareOffcanvasNew.vue"

export default {
  components: { ShareOffcanvas },
  setup() {
    const store = useStore()
    const footerStyle = computed(() => store.getters["setting/footer_style"])

    // Bottom Canvas
    const shareOffcanvas = ref(false)
    watch(
      () => store.getters.shareOffcanvas,
      (newValue) => {
        shareOffcanvas.value = newValue
      }
    )
    const hideShareOffcanvas = () => {
      store.dispatch("openBottomCanvasAction", { name: "shareOffcanvas", value: false })
    }
    return {
      footerStyle,
      shareOffcanvas,
      hideShareOffcanvas
    }
  }
}
</script>
