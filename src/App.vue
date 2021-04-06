<template>
  <v-app id="inspire">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import Vue from 'vue'
export default {
  beforeMount(){
    Vue.prototype.$urlLink = process.env.VUE_APP_URL_LINK;
    Vue.prototype.$localIp = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    Vue.prototype.$flowEntry = process.env.VUE_APP_FLOWENTRY;
    Vue.prototype.$signature = process.env.VUE_APP_SIGNATURE;
    Vue.prototype.$version = process.env.VUE_APP_VERSION;
  }
}
</script>
<style scoped>
#inspire {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
  }
  #inspire::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
</style>