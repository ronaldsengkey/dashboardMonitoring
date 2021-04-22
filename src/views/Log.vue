<template>
  <v-card shaped outlined :loading="cardLoad">
    <v-card-title class="primary white--text">
      Log
      <v-spacer></v-spacer>
      <v-chip class="mx-2" :disabled="crud_disabled" @click="showLog('crud')" :outlined="crud_log"
        >CRUD log</v-chip
      >
      <v-chip class="mx-2" :disabled="em_disabled" @click="showLog('employee')" :outlined="em_log"
        >Employee Activity log</v-chip
      >
      <v-chip class="mx-2" :disabled="cs_disabled" @click="showLog('customer')" :outlined="cs_log"
        >Customer Activity log</v-chip
      >
      <v-spacer></v-spacer>
      <v-btn icon medium @click="refreshData()">
        <v-icon color="white">mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text :key="keyTable">
      <!-- <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field> -->
      <v-data-table
        :headers="headers"
        :items="logData"
        :search="search"
        no-data-text="empty data"
        no-results-text="empty results"
        multi-sort
        loading="load"
        v-if="!crud_log"
      >
        <template v-slot:body="props">
          <tbody>
            <tr v-for="item in props.items" :key="item.id">
              <td v-for="field in Object.keys(item)" :key="field">
                {{ item[field] }}
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
                  v-model="createdDatetime"
                  type="text"
                  label="date"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <v-data-table
        :headers="headerActivity"
        :items="logActivityData"
        :search="searchActivity"
        no-data-text="empty data"
        no-results-text="empty results"
        multi-sort
        loading="loadActivity"
        v-else
      >
        <template v-slot:body="props">
          <tbody>
            <tr v-for="item in props.items" :key="item.id">
              <td v-for="field in Object.keys(item)" :key="field">
                {{ item[field] }}
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field
                  v-model="accessor"
                  type="text"
                  label="Accessor"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="accessorCategory"
                  type="text"
                  label="Accessor Category"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="link"
                  type="text"
                  label="Link"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="method"
                  type="text"
                  label="Method"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="status"
                  type="text"
                  label="Status"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="moduleName"
                  type="text"
                  label="Module Name"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="information"
                  type="text"
                  label="Information"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  v-model="createdDate"
                  type="text"
                  label="date"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card-text>
    <v-snackbar :timeout="timeout" v-model="snackbar" rounded="pill" dense>
      {{ tokenResponse }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
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
  mounted() {
    this.load = true;
    this.cardLoad = "info";
    this.logData = "";
  },
  computed: {
    logData: function () {
      this.load = false;
      this.loadActivity = false;
      this.cardLoad = false;
      this.cs_disabled = false;
      this.em_disabled = false;
      this.crud_disabled = false;
      if (this.$store.getters.getMomentedLog == 401) {
        this.snackbar = true;
        this.tokenResponse = "token expired, please login again";
        this.doLogout("Logout");
      } else return this.$store.getters.getMomentedLog;
    },
    logActivityData: function(){
      this.load = false;
      this.loadActivity = false;
      this.cardLoad = false;
      this.cs_disabled = false;
      this.em_disabled = false;
      this.crud_disabled = false;
      if (this.$store.getters.getActivityLog == 401) {
        this.snackbar = true;
        this.tokenResponse = "token expired, please login again";
        this.doLogout("Logout");
      } else return this.$store.getters.getActivityLog;
    },
    headerActivity() {
      return [
        {
          text: "Accessor",
          value: "accessor",
          filter: (value) => {
            if (!this.accessor) return true;
            return value.toLowerCase().includes(this.accessor.toLowerCase());
          },
        },
        {
          text: "Accessor Category",
          value: "accessorCategory",
          filter: (value) => {
            if (!this.accessorCategory) return true;
            return value.toLowerCase().includes(this.accessorCategory.toLowerCase());
          },
        },
        {
          text: "Link",
          value: "link",
          filter: (value) => {
            if (!this.link) return true;
            return value.toLowerCase().includes(this.link.toLowerCase());
          },
        },
        {
          text: "Method",
          value: "method",
          filter: (value) => {
            if (!this.method) return true;
            return value.toLowerCase().includes(this.method.toLowerCase());
          },
        },
        {
          text: "Status",
          value: "status",
          filter: (value) => {
            if (!this.status) return true;
            return value.toLowerCase().includes(this.status.toLowerCase());
          },
        },
        {
          text: "Module Name",
          value: "moduleName",
          filter: (value) => {
            if (!this.moduleName) return true;
            return value
              .toLowerCase()
              .includes(this.moduleName.toLowerCase());
          },
        },
        {
          text: "Information",
          value: "information",
          filter: (value) => {
            if (!this.information) return true;
            return value
              .toLowerCase()
              .includes(this.information.toLowerCase());
          },
        },
        {
          text: "Created Date",
          value: "createdDate",
          filter: (value) => {
            if (!this.createdDate) return true;
            return value
              .toLowerCase()
              .includes(this.createdDate.toLowerCase());
          },
        },
      ];
    },
    headers() {
      return [
        {
          text: "Category",
          value: "category",
          filter: (value) => {
            if (!this.categories) return true;
            return value.toLowerCase().includes(this.categories.toLowerCase());
          },
        },
        {
          text: "Module",
          value: "module",
          filter: (value) => {
            if (!this.modules) return true;
            return value.toLowerCase().includes(this.modules.toLowerCase());
          },
        },
        {
          text: "Description",
          value: "description",
          filter: (value) => {
            if (!this.descriptions) return true;
            return value
              .toLowerCase()
              .includes(this.descriptions.toLowerCase());
          },
        },
        {
          text: "User ID",
          value: "user_id",
          filter: (value) => {
            if (!this.userId) return true;
            return value == this.userId;
          },
        },
        {
          text: "Username",
          value: "user_name",
          filter: (value) => {
            if (!this.userName) return true;
            return value.toLowerCase().includes(this.userName.toLowerCase());
          },
        },
        {
          text: "Created At",
          value: "created_datetime",
          filter: (value) => {
            if (!this.createdDatetime) return true;
            return value
              .toLowerCase()
              .includes(this.createdDatetime.toLowerCase());
          },
        },
      ];
    },
  },
  methods: {
    async doLogout(title) {
      if (title == "Logout") {
        let uriEncodeLogin = encodeURIComponent(this.$localIp);
        const headers = {
          "Content-Type": "application/json",
          signature: this.$signature,
          token: JSON.parse(
            window.atob(window.localStorage.getItem("loginData"))
          ).token,
          Accept: "*/*",
          "Cache-Control": "no-cache",
          uri: uriEncodeLogin,
        };

        const request = new Request("logout", {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
        });
        let res = await fetch(request);
        let resJson = await res.json();
        if (resJson.responseCode == "200") {
          // await this.clearState()
          window.location.href = decodeURIComponent(uriEncodeLogin);
        } else {
          this.snackbar = true;
          this.tokenResponse = resJson.responseMessage;
        }
      }
    },
    refreshData: function () {
      this.load = true;
      this.cardLoad = "info";
      if(this.crud_log == false){
        let data = { signature: this.$signature, link: this.$urlLink };
        this.$store.dispatch("getLogList", data);
      } else {
        let concernRefresh;
        if(this.em_log == false) concernRefresh = 'employee'; else concernRefresh = 'customer'
        let dataEmp = { signature: this.$signature, link: this.$urlLink, category: concernRefresh};
        this.keyTable += 1;
        this.$store.dispatch("getLogActivityList", dataEmp);
      }
      this.keyTable += 1;
    },
    async showLog(concern) {
      this.cardLoad = "info";
      switch (concern) {
        case "crud":
          this.crud_log = false;
          this.em_log = true;
          this.cs_log = true;
          this.cs_disabled = true;
          this.em_disabled = true;
          this.load = true;
          let data = { signature: this.$signature, link: this.$urlLink };
          this.$store.dispatch("getLogList", data);
          this.keyTable += 1;
          break;
        case "employee":
          this.crud_log = true;
          this.em_log = false;
          this.cs_log = true;
          this.crud_disabled = true;
          this.cs_disabled = true;
          this.loadActivity = true;
          let dataEmp = { signature: this.$signature, link: this.$urlLink, category: concern};
          this.keyTable += 1;
          this.$store.dispatch("getLogActivityList", dataEmp);
          break;
        default:
          this.crud_log = true;
          this.em_log = true;
          this.cs_log = false;
          this.crud_disabled = true;
          this.em_disabled = true;
          this.loadActivity = true;
          let dataCS = { signature: this.$signature, link: this.$urlLink, category: concern};
          this.keyTable += 1;
          this.$store.dispatch("getLogActivityList", dataCS);
          break;
      }
    },
  },
  data: () => ({
    search: "",
    tokenResponse: "",
    snackbar: false,
    timeout: 3000,
    // default value for custom search
    categories: "",
    modules: "",
    descriptions: "",
    userId: null,
    userName: "",
    createdDatetime: "",

    // chip activation
    crud_log: false,
    em_log: true,
    cs_log: true,
    crud_disabled: false,
    em_disabled: false,
    cs_disabled:false,

    // default value activity log
    accessor : "",
    accessorCategory : "",
    moduleName : "",
    information : "",
    link : "",
    method : "",
    status: "",
    createdDate : "",
    searchActivity: "",

    // update component
    keyTable: 0,
    load: true,
    loadActivity:false,
    cardLoad: false,
  }),
};
</script>