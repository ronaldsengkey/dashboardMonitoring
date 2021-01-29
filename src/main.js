import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/index'
import vuetify from './plugins/vuetify';

Vue.use(require("moment"));
Vue.config.productionTip = false
Vue.prototype.$urlLink = 'http://192.168.0.96:8443'
Vue.prototype.$localIp = 'http://192.168.0.228:8109/#/'
Vue.prototype.$flowEntry = 'itDashboard'

//format = itDashboard:key
Vue.prototype.$signature = 'aXREYXNoYm9hcmQ6RXpzRk00WldpTXhtZnpQRFFGanNLNFlTRUFRNkV2U1BKbWEvMnRwQ29LQTJTZnc1bUxOaXczV0ZNQWRCUTFlYlpaaUh6ZzhINDEvN0E5Y1c3YkVON2tNMTBicitQcTZML3FtamVEMkpQVUdxbmZPcjVLNFNnQkErWVJ0SzdBTktlOGlSaHZNNWhJaWlNeE9TaFJFQ1B3UE9xdDVBSmQ3bElRYWNXRmdUZHhvPQ=='

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


