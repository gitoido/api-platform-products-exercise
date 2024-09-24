import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import pinia from './store'
import { PiniaVuePlugin } from 'pinia'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false


Vue.use(PiniaVuePlugin)

new Vue({
  vuetify,
  pinia,
  render: h => h(App)
}).$mount('#app')
