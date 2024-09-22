import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './axios'

// Library Components
import VueSweetalert2 from 'vue-sweetalert2'
import VueApexCharts from 'vue3-apexcharts'
import BootstrapVue3 from 'bootstrap-vue-3'
// import Vue3Autocounter from 'vue3-autocounter';
// import Select2 from 'vue3-select2-component';

import 'aos/dist/aos.css'
import '@/assets/custom-vue/css/custom.css'
// import '@/assets/themify/themify-icons.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

// Custom Components & Directives
import globalComponent from './plugins/global-components'
import globalDirective from './plugins/global-directive'
import globalMixin from './plugins/global-mixin'
import html2pdf from 'html2pdf.js';

require('waypoints/lib/noframework.waypoints.min')


library.add(faUserSecret)

const app = createApp(App)
app.use(store).use(router)

// Library Components
app.use(VueSweetalert2)
app.use(VueApexCharts)
app.use(BootstrapVue3)
// app.component('counter-up', Vue3Autocounter)
app.component('font-awesome-icon', FontAwesomeIcon)
// app.component('Select2', Select2)


// Custom Components & Directives
app.use(globalComponent)
app.use(globalDirective)
app.use(html2pdf)
app.mixin(globalMixin)


app.mount('#app')

export default app
