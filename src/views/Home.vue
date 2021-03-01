<template>
  <div class="home">
    <v-layout fill-height>
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        app
      >
        <v-list-item class="listItem secondary">
          <v-list-item-avatar>
            <v-img :src="adminImage"></v-img>
          </v-list-item-avatar>
          <v-list-item-title class="title white--text">
            {{adminName}}
          </v-list-item-title>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon color="white">mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" :name="item.title" router :to="item.link" @click="doLogout(item.title)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>

    <v-snackbar
      :timeout="timeout"
      v-model="snackbar"
      rounded="pill"
      dense
    >
      {{logoutResponse}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>

    </v-snackbar>

    <v-app-bar class="appbar primary" app>
      <v-toolbar-title class="white--text">IT Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-main style="padding:6px 0px 0px 12px">
      <router-view></router-view>
    </v-main>
  </div>
</template>
<script>
export default {
  data: () => ({
    timeout: 3000,
    snackbar:false,
    logoutResponse:'',
    adminName: '',
    adminImage:'https://randomuser.me/api/portraits/men/85.jpg',
    drawer: null,
    items: [
      { title: "Dashboard", icon: "mdi-view-dashboard",link: "/home" },
      { title: "Log", icon: "mdi-laptop",link: "/log" },
      { title: "Profile", icon: "mdi-card-account-details",link: "/profile" },
      { title: "Logout", icon: "mdi-logout-variant",link: "" },
    ],
    mini: true,
  }),
  mounted(){
    this.adminName = JSON.parse(window.atob(window.localStorage.getItem('loginCred'))).employee_name
    this.adminImage = JSON.parse(window.atob(window.localStorage.getItem('loginCred'))).employee_profile_img
  },
  methods:{
    async clearState(){
      let state = this.$store.state;
      let newState = {};

      Object.keys(state).forEach(key => {
        newState[key] = []; // or = initialState[key]
      });

      this.$store.replaceState(newState);
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
          if(resJson.responseCode == '200'){
            // await this.clearState()
            setTimeout(() => {
              window.location.href = decodeURIComponent(uriEncodeLogin)
            }, 1000);
          } else {
            this.snackbar = true;
            this.logoutResponse = resJson.responseMessage
          }
      }
    }
  },
};
</script>

<style scoped>
  .appbar{
    height: 56px !important
  }

  .listItem {
    padding: 0 10px
  }

  .home {
    padding: 15px
  }
</style>