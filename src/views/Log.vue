<template>
  <v-card shaped outlined :loading="cardLoad">
    <v-card-title class="primary white--text">
      Log
      <v-spacer></v-spacer>
      <v-btn icon medium @click="refreshData()">
        <v-icon color="white">mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text :key="keyTable">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="logData"
        :search="search"
        no-data-text="empty data"
        no-results-text="empty results"
        multi-sort
        loading="load"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
       <template v-slot:body="props">
        <tbody>
          <tr v-for="item in props.items" :key="item.id">
            <td v-for="field in Object.keys(item)" :key="field">
              {{item[field]}}
            </td>
          </tr>
          <tr>
            <td>
              <v-text-field
                v-model="categories"
                type="text"
                label="Category"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="modules"
                type="text"
                label="Module"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="descriptions"
                type="text"
                label="Description"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="userId"
                type="number"
                label="user id"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="userName"
                type="text"
                label="username"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                v-model="createdAt"
                type="text"
                label="date"
              ></v-text-field>
            </td>
          </tr>
        </tbody>
      </template>
      </v-data-table>
    </v-card-text>
    <v-snackbar
        :timeout="timeout"
        v-model="snackbar"
        rounded="pill"
        dense
      >
        {{tokenResponse}}
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
  </v-card>
</template>

<script>
export default {
  beforeMount() {
    let data = { signature: this.$signature, link: this.$urlLink };
    this.$store.dispatch("getLogList", data);
  },
  computed: {
    logData: function () {
      this.load = false;
      this.cardLoad = false;
      if(this.$store.getters.getMomentedLog == 401){
        this.snackbar = true;
        this.tokenResponse = 'token expired, please login again';
        this.doLogout('Logout');
      } else 
      return this.$store.getters.getMomentedLog;
    },
    headers() {
      return [
        {
          text: "Category",
          value: "category",
          filter: (value) => {
            if (!this.categories) return true
            return value.toLowerCase().includes((this.categories).toLowerCase());
          },
        },
        { text: "Module", value: "module",
          filter: (value) => {
            if (!this.modules) return true
            return value.toLowerCase().includes((this.modules).toLowerCase());
          },
        },
        { text: "Description", value: "description",
          filter: (value) => {
            if (!this.descriptions) return true
            return value.toLowerCase().includes((this.descriptions).toLowerCase());
          },
        },
        { text: "User ID", value: "user_id",
         filter: (value) => {
            if (!this.userId) return true
            return value == this.userId;
          },
        },
        { text: "Username", value: "user_name",
          filter: (value) => {
            if (!this.userName) return true
            return value.toLowerCase().includes((this.userName).toLowerCase());
          },
        },
        { text: "Created At", value: "created_at",
           filter: (value) => {
              if (!this.createdAt) return true
              return value.toLowerCase().includes((this.createdAt).toLowerCase());
            },
        },
      ];
    },
  },
  methods: {
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
            // await this.clearState()
            setTimeout(() => {
              window.location.href = decodeURIComponent(uriEncodeLogin)
            }, 1000);
          } else {
            this.snackbar = true;
            this.tokenResponse = resJson.responseMessage
          }
      }
    },
    refreshData: function () {
      this.load = true;
      this.cardLoad = "info";
      let data = { signature: this.$signature, link: this.$urlLink };
      this.$store.dispatch("getLogList", data);
      this.keyTable += 1;
    },
  },
  data: () => ({
    search: "",
    tokenResponse: '',
    snackbar:false,
    timeout:3000,
    // default value for custom search
    categories:'',
    modules:'',
    descriptions:'',
    userId: 0,
    userName:'',
    createdAt:'',

    // update component
    keyTable: 0,
    load: true,
    cardLoad: false,
    sortDesc: true,
    sortBy: ["created_at"],
  }),
};
</script>