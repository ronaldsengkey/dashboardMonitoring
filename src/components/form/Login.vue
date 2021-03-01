<template>
  <div class="login">
    <v-card color="transparent" width="350" :loading="loading">
      <template slot="progress">
        <v-progress-linear
          color="primary"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-skeleton-loader
        v-if="load"
        class="mx-auto mb-3"
        max-width="300"
        type="card"
        elevation="3"
      ></v-skeleton-loader>
      <v-img
        v-if="!load"
        aspect-ratio="1.3"
        position="center"
        contain
        class="text-center ultipay"
        eager
        src="@/assets/logo.png"
      ></v-img>
      <v-form v-if="!load" ref="form" lazy-validation>
        <v-container>
          <v-text-field
            v-model="email"
            :rules="[rules.required]"
            label="Email"
            autocomplete="off"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            autocomplete="off"
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-btn @click="login()" min-width="100%">Login</v-btn>
        </v-container>
      </v-form>
    </v-card>
    <v-snackbar :timeout="timeout" v-model="snackbar" rounded="pill" dense>
      {{ loginResponse }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "FormLogin",
  data() {
    return {
      load: false,
      snackbar: false,
      loginResponse: "",
      timeout: 3000,
      signature: this.$signature,
      loading: false,
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      // email: "dickybudianto+itg4@usahakreatif.co.id",
      // password: "111111",
      email: '',
      password: '',
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  async mounted() {
    let storageCheck = window.localStorage.getItem('loginData');
    this.load = true;
    if (storageCheck !== null || storageCheck !== undefined || storageCheck !== '') {
      try {
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
          'uri':encodeURIComponent(this.$localIp)
        };

        const request = new Request('checkToken', {
          method: "GET",
          headers: headers,
        });
        let res = await fetch(request);
        let resJson = await res.json();
        this.load = false;
        if(resJson.responseCode == '200'){
          window.location.href = this.$localIp +'home'
        }
      } catch (error) {
        this.load = false;
      }
    } else {
      this.load = false;
    }
  },
  methods: {
    async fireGetData(redirectUri){
      let headers = {
        Accept: "*/*",
        "Cache-Control": "no-cache",
        signature: this.$signature,
        "content-type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem('loginData'))).token,
        'uri': encodeURIComponent(this.$localIp)
      };

      const request = new Request('employeeData', {
        method: "GET",
        headers: headers,
      });
      let res = await fetch(request);
      let resJson = await res.json();
      this.snackbar = true;
      this.loading = false;
      if(resJson.responseCode == 200 || resJson.responseCode == '200') {
        this.loginResponse = 'login success';
        window.localStorage.setItem('loginCred',window.btoa(JSON.stringify(resJson.data)));
        setTimeout(() => {
            window.location.href = redirectUri;
        }, 500);
      } else {
        await this.doLogout('Logout');
      }
    },

    async doLogout(title){
      if(title == 'Logout'){
        let uriEncodeLogin = encodeURIComponent(this.$localIp);
        const headers = {
            'Content-Type': 'application/json',
            'signature': this.$signature,
            token:JSON.parse(window.atob(window.localStorage.getItem('loginData'))).token,
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "uri":uriEncodeLogin
          }

          const request = new Request(
            'logout',
            {
              method: "POST",
              headers:headers,
            }
          );
          let res = await fetch(request)
          let resJson = await res.json();
          this.snackbar = true;
          if(resJson.responseCode == '200'){
            this.loginResponse = 'Login Failed, please try again'
          } else {
            this.loginResponse = resJson.responseMessage
          }
      }
    },

    async login() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        let email = this.email;
        let password = this.password;
        let dataLogin = {
          email: email,
          password: password,
        };
        this.loading = true;

        let uriEncode = encodeURIComponent(this.$localIp) + "home";

        const headers = {
          "Content-Type": "application/json",
          signature: this.signature,
          Accept: "*/*",
          "Cache-Control": "no-cache",
          'uri': uriEncode,
          'body': JSON.stringify(dataLogin)
        };

        const request = new Request(
          'login',
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify(dataLogin),
          }
        );
        let res = await fetch(request);
        let resJson = await res.json();
        console.log('ress',resJson);
        if (resJson.responseCode == "200") {
          window.localStorage.setItem('loginData',window.btoa(JSON.stringify(resJson.data)));
          await this.fireGetData(resJson.data.redirectUri);
        } else if(resJson.responseCode == '401' && resJson.responseMessage.includes('already login')) {
          this.loading = false;
          try {
            let storageCheck = window.localStorage.getItem('loginData');
            if (storageCheck !== null || storageCheck !== undefined || storageCheck !== '') {
             await this.doLogout('Logout')
            }
          } catch (error) {
            
          }
         
        } else {
          this.loginResponse = resJson.responseMessage;
          this.snackbar = true;
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.login {
  height: 100vh !important;
  align-items: center;
  justify-content: center;
  display: flex;
  /* background-image: url("../../../src/assets/cs.svg"); */
  background: linear-gradient(40deg, #ffd86f, #fc6262) !important;
}
</style>