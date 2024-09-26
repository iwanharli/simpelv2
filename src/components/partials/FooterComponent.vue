<template>
  <!-- Footer Section Start -->
  <footer :class="`footer ${footerStyle}`" style="display: none;">
    <div class="footer-body">
      <ul class="left-panel list-inline mb-0 p-0">
        <li class="list-inline-item">Privacy Policy</li>
        <li class="list-inline-item">Terms of Use</li>
      </ul>
      <div class="right-panel">©2023, Made by <a href="#">SIMPEL</a>.</div>
    </div>
  </footer>


  <!-- NAVIGATION BOTTOM  -->
  <nav class="navbarBottom p-3">
    <div class="button-group">
      <button class="btn btn-lg btn-primary rounded-5 me-2">Button 1</button>
      <button class="btn btn-lg btn-warning rounded-5">Button 2</button>
    </div>
  </nav>

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

<style>
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
