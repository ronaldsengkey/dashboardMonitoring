<template>
  <v-fade-transition mode="out-in">
    <div class="landing grey lighten-5 p-5">
      <TabLanding />
      <v-snackbar :timeout="timeout" v-model="snackbar" rounded="pill" dense>
        {{ checkTokenResponse }}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-fade-transition>
</template>

<script>
import TabLanding from '@/views/TabLanding';

export default {
  data: () => ({
    show:false,
    snackbar: false,
    checkTokenResponse: "",
    timeout: 3000,
  }),
  methods: {
    async checkToken(storageCheck){
      let storageData = JSON.parse(window.atob(storageCheck));
      let authorization =
        "ultimate " + storageData.keyId + ":" + storageData.keySecret;
      let tokenData = storageData.token;

      let headers = {
        Accept: "*/*",
        "Cache-Control": "no-cache",
        Authorization: authorization,
        signature: this.$signature,
        "content-type": "application/json",
        token: tokenData,
      };
      let finalUrl = this.$urlLink + "/authentication/identifier"+
      "?v=1" +
        "&flowEntry=" +
        this.$flowEntry +
        "&continue=" +
        encodeURIComponent(this.$localIp);

      const request = new Request(finalUrl, {
        method: "GET",
        headers: headers,
        redirect: "follow",
        mode: "cors",
      });
      let res = await fetch(request);
      let resJson = await res.json();
      if(resJson.responseCode == 401 || resJson.responseCode == '401') {
        this.snackbar = true;
        this.checkTokenResponse = resJson.responseMessage;
        setTimeout(() => {
          window.location.href = this.$localIp
        }, 1500);
      }
      return resJson.responseCode;
    },
    async doLogout(title){
      if(title == 'Logout'){
        const headers = {
            'Content-Type': 'application/json',
            'signature': this.$signature,
            token:JSON.parse(window.atob(window.localStorage.getItem('loginData'))).token,
            "Accept": "*/*",
            "Cache-Control": "no-cache",
          }

          let uriEncodeLogin = encodeURIComponent(this.$localIp);
          const request = new Request(
            this.$urlLink+'/authentication/logout?v=1&continue='+uriEncodeLogin+'&flowEntry='+this.$flowEntry+'',
            {
              method: "POST",
              headers:headers,
              redirect:'follow',
              mode: "cors",
            }
          );
          let res = await fetch(request)
          let resJson = await res.json();
          if(resJson.responseCode == '200'){
            this.$store.dispatch('SOCKET_toDisconnect');
            await this.clearState()
            setTimeout(() => {
              window.location.href = decodeURIComponent(uriEncodeLogin)
              window.location.reload()
            }, 1000);
          } else {
            this.snackbar = true;
            this.logoutResponse = resJson.responseMessage
          }
      }
    }
  },
  async beforeMount(){
    let storageCheck = localStorage.getItem('loginData');
    try {
      if (storageCheck != null || storageCheck != undefined || storageCheck !== '') {
      let data = await this.checkToken(storageCheck);
      if(data != 200){
        doLogout('Logout');
      }
    }
    } catch (error) {
      
    }
  },
  components: {TabLanding},
  name: "Landing",
};
</script>