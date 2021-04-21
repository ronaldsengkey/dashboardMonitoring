<template>
  <v-container>
    <v-dialog v-model="dialogAdd" max-width="600px">
      <v-card :loading="addFormLoading">
        <v-card-title>
          <span class="headline">{{ formName }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="addForm" lazy-validation>
              <v-row v-for="(item, i) in formItems" :key="i" cols="12">
                <v-col cols="12" v-if="item.type == 'text'">
                  <v-text-field
                    v-model="modelForm[item.model]"
                    :label="item.label"
                    :rules="rules"
                    required
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="item.type == 'textarea'">
                  <v-textarea
                    v-model="modelForm[item.model]"
                    :label="item.label"
                    :rules="rules"
                    required
                    autocomplete="off"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" v-if="item.type == 'number'">
                  <v-text-field
                    v-model="modelForm[item.model]"
                    :label="item.label"
                    :rules="rules"
                    required
                    type="number"
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  v-if="item.type == 'dropdown' && item.request"
                >
                  <v-select
                    v-model="modelForm[item.model]"
                    :items="item.value"
                    :label="item.label"
                    item-text="nicename"
                    item-value="id"
                    autocomplete="off"
                    :rules="rules"
                    required
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  v-if="item.type == 'dropdown' && !item.request"
                >
                  <v-select
                    v-model="modelForm[item.model]"
                    :items="item.value"
                    :label="item.label"
                    autocomplete="off"
                    :rules="rules"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" :disabled="addFormLoading"  text @click="dialogAdd = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1"  :disabled="addFormLoading"  text @click="saveForm(formConcern)">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogList">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchMaster"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            autocomplete="off"
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="dataMaster"
            :loading="tableLoad"
            :search="searchMaster"
            sort-by="id"
            sort-desc
            class="elevation-1"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogEdit" max-width="500px">
                <v-card :loading="editFormLoading">
                  <v-card-text>
                    <v-container>
                      <v-form ref="editForm" lazy-validation>
                        <v-row
                          v-for="(itemEdit, keys) in editedItem"
                          :key="keys"
                        >
                          <v-col cols="12">
                            <v-textarea
                              v-if="keys == 'description'"
                              autocomplete="off"
                              v-model="modelEditForm[keys]"
                              :rules="rules"
                              :ref="keys"
                              :value="itemEdit"
                              :label="keys"
                            ></v-textarea>
                            <v-text-field
                              v-else-if="
                                keys !== 'name' &&
                                keys !== 'lat' &&
                                keys !== 'title' &&
                                keys !== 'currency' &&
                                keys !== 'symbol' &&
                                keys !== 'lng' &&
                                keys !== 'code' &&
                                keys !== 'iso' &&
                                keys !== 'iso3' &&
                                keys !== 'nicename' &&
                                keys !== 'numcode' &&
                                keys !== 'notification_name' &&
                                keys !== 'notification_values' &&
                                keys !== 'category' &&
                                keys !== 'phonecode'
                              "
                              disabled
                              v-model="modelEditForm[keys]"
                              :ref="keys"
                              :value="itemEdit"
                              :label="keys"
                            ></v-text-field>
                            <v-text-field
                              v-else
                              autocomplete="off"
                              :rules="rules"
                              v-model="modelEditForm[keys]"
                              :ref="keys"
                              :value="itemEdit"
                              :label="keys"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" :disabled="editFormLoading" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" :disabled="editFormLoading" text @click="save(formTitle)">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card :loading="deleteFormLoading">
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirm(formTitle)"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon :disabled="deleteFormLoading" small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon :disabled="deleteFormLoading"  small @click="deleteItem(item, formTitle)">
                mdi-delete
              </v-icon>
            </template>
            <!-- <template v-slot:no-data>
              <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template> -->
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogList = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialogList = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row dense class="gridLayout3">
      <v-col v-for="(item, i) in items" :key="i" cols="12">
        <v-card class="mx-auto" max-width="344" :loading="item.loading">
          <v-img :src="item.src" height="200px"></v-img>
          <v-card-actions>
            <v-card-title v-text="item.title"></v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              class="ml-2"
              color="primary"
              @click.stop="openDialog(item.concern, item)"
              v-if="item.concern != 'employee' && item.concern != 'vendor' && item.concern != 'partner' && item.concern != 'customer'"
            >
              Add
            </v-btn>
            <v-btn
              class="ml-2"
              color="primary"
              @click.stop="
                getMasterData(item.concern, item);
              "
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar :timeout="timeout" v-model="snackbar" rounded="pill" dense>
      {{ requestMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-speed-dial
      v-model="fab"
      fixed
      class="search"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-magnify </v-icon>
        </v-btn>
      </template>
      <!-- <v-btn
        fab
        dark
        small
        color="secondary"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn> -->
      <v-card class="shortcutPlace">
        <v-card-title @click.stop>
          <v-text-field
            v-on:input="handleShortcut"
            v-model="shortcut"
            placeholder="search shortcut"
          ></v-text-field>
        </v-card-title>
      </v-card>
    </v-speed-dial>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    shortcut: "",
    direction: "left",
    fab: false,
    hover: false,
    transition: "slide-y-reverse-transition",
    rules: [(value) => !!value || "Required."],

    formTitle: "",
    formItems: [],
    formName: "",
    formConcern: "",
    searchMaster: "",

    dialogAdd: false,
    dialogList: false,
    dialogEdit: false,
    dialogDelete: false,

    snackbar: false,
    timeout: 2000,
    requestMessage: "",

    addFormLoading:false,
    editFormLoading:false,
    deleteFormLoading:false,

    modelForm: {},
    modelEditForm: {},
    tableLoad: false,
    items: [
      {
        title: "Identity App",
        loading: "false",
        concern: "identity_app",
        src: require("../assets/master/identity_app.svg"),
      },
      // {
      //   title: "Customer",
      //   loading: "false",
      //   concern: "customer",
      //   src: require("../assets/master/customer.svg"),
      // },
      // {
      //   title: "Partner",
      //   loading: "false",
      //   concern: "partner",
      //   src: require("../assets/partner.svg"),
      // },
      // {
      //   title: "Employee",
      //   loading: "false",
      //   concern: "employee",
      //   src: require("../assets/employee.svg"),
      // },
      // {
      //   title: "Vendor",
      //   loading: "false",
      //   concern: "vendor",
      //   src: require("../assets/master/vendor.svg"),
      // },
      {
        title: "Division",
        loading: "false",
        concern: "division",
        src: require("../assets/master/division.svg"),
      },
      {
        title: "Bank",
        loading: "false",
        concern: "bank",
        src: require("../assets/master/bank.svg"),
      },
      {
        title: "Ticketing Topic",
        loading: "false",
        concern: "ticketing_topic",
        src: require("../assets/master/ticketing_topic.svg"),
      },
      {
        title: "Ticketing Type",
        loading: "false",
        concern: "ticketing_type",
        src: require("../assets/master/ticketing_type.svg"),
      },
      {
        title: "City",
        loading: "false",
        concern: "city",
        src: require("../assets/master/city.svg"),
      },
      {
        title: "Country",
        loading: "false",
        concern: "country",
        src: require("../assets/master/country.svg"),
      },
      {
        title: "Currency",
        loading: "false",
        concern: "currency",
        src: require("../assets/master/currency.svg"),
      },
      {
        title: "Tenant Category",
        loading: "false",
        concern: "tenant_category",
        src: require("../assets/master/tenant_category.svg"),
      },
      {
        title: "Notification",
        loading: "false",
        concern: "notification",
        src: require("../assets/master/notification.svg"),
      }
    ],
    headers: [],
    dataMaster: [],
    editedItem: {},
    backUpShortcut: [],
  }),
  mounted() {
    this.items = this.items.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
    this.backUpShortcut = this.items;
  },
  methods: {
    async handleShortcut() {
      // console.log('shot',this.shortcut);
      let searchh = this.shortcut;
      if (searchh != "")
        this.items = this.items.filter(function(e){ return e.title.toUpperCase().indexOf(searchh.toUpperCase()) > -1})
        // this.items = this.items.some((e) =>
        //   e.title.toUpperCase().indexOf(searchh.toUpperCase())
        // );
      else this.items = this.backUpShortcut;
    },
    async saveForm(concern) {
      console.log("form", concern);
      if (this.$refs.addForm.validate()) {
        this.addFormLoading = true;
        let bodyForm;
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
        bodyForm = this.modelForm;
        console.log("bodd", bodyForm);
        const request = new Request(concern, {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(bodyForm),
        });
        let res = await fetch(request);
        let resJson = await res.json();
        this.addFormLoading = false;
        if (resJson.responseCode == "200") {
          console.log("res", resJson);
          this.dialogAdd = false;
          this.snackbar = true;
          this.requestMessage = resJson.responseMessage;
        } else {
          this.snackbar = true;
          this.requestMessage = resJson.responseMessage;
        }
      }
    },
    async openDialog(concern, item) {
      this.formName = item.title + " form";
      this.formConcern = item.concern;
      switch (concern) {
        case "identity_app":
          this.formItems = [
            {
              label: "Name",
              model: "name",
              type: "text",
            },
            {
              label: "Category",
              model: "category",
              type: "dropdown",
              request:false,
              value: ["api", "web", "app"],
            },
          ];
          break;
        case "ticketing_type":
          this.formItems = [
            {
              label: "Title",
              model: "title",
              type: "text",
            },
            {
              label: "Description",
              model: "description",
              type: "textarea",
            },
          ];
          break;
        case "ticketing_topic":
        case "division":
          this.formItems = [
            {
              label: "Name",
              model: "name",
              type: "text",
            },
          ];
          break;
        case "bank":
          this.formItems = [
            {
              label: "Name",
              model: "name",
              type: "text",
            },
            {
              label: "Code",
              model: "code",
              type: "number",
            },
          ];
          break;
        case "country":
          this.formItems = [
            {
              label: "ISO",
              model: "iso",
              type: "text",
            },
            {
              label: "Name",
              model: "name",
              type: "text",
            },
            {
              label: "Nice Name",
              model: "nicename",
              type: "text",
            },
            {
              label: "ISO3",
              model: "iso3",
              type: "number",
            },
            {
              label: "Num Code",
              model: "numcode",
              type: "number",
            },
            {
              label: "Phone Code",
              model: "phonecode",
              type: "text",
            },
          ];
          break;
        case "city":
          this.formItems = [
            {
              label: "Name",
              model: "name",
              type: "text",
            },
            {
              label: "Lat",
              model: "lat",
              type: "text",
            },
            {
              label: "Long",
              model: "lng",
              type: "text",
            },
          ];
          break;
        case "tenant_category":
          this.formItems = [
            {
              label: "Name",
              model: "name",
              type: "text",
            }
          ];
          break;
        case "currency":
          let countryList = await this.getMasterDataOnly("country");
          if (countryList.length == 0) return;
          this.formItems = [
            {
              label: "Country",
              model: "country_id",
              type: "dropdown",
              request: true,
              value: countryList,
            },
            {
              label: "Currency",
              model: "currency",
              type: "text",
            },
            {
              label: "Code",
              model: "code",
              type: "text",
            },
            {
              label: "Symbol",
              model: "symbol",
              type: "text",
            },
          ];
          break;
        case "notification":
          this.formItems = [
            {
              label: "Name",
              model: "notification_name",
              type: "text",
            },
            {
              label: "Value",
              model: "notification_values",
              type: "text",
            },
            {
              label: "Category",
              model: "category",
              type: "text",
            }
          ];
          break;
      }
      this.dialogAdd = true;
    },
    async getMasterDataOnly(concern) {
      let uriEncodeLogin = encodeURIComponent(this.$localIp);
      const headers = {
        "Content-Type": "application/json",
        signature: this.$signature,
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        uri: uriEncodeLogin,
      };
      const request = new Request(concern, {
        method: "GET",
        headers: headers,
        redirect: "follow",
        mode: "cors",
      });
      let res = await fetch(request);
      let resJson = await res.json();
      if (resJson.responseCode == "200") {
        return resJson.data;
      } else {
        this.snackbar = true;
        this.requestMessage = resJson.responseMessage;
      }
    },
    async getMasterData(concern, item) {
      console.log("xx", concern);
      switch (concern) {
        case "identity_app":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Name", value: "name" },
            { text: "Code", value: "code", sortable: false },
            { text: "App ID", value: "app_id", sortable: false },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case 'tenant_category':
        case "ticketing_topic":
        case "division":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Name", value: "name" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "bank":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Code", value: "code" },
            { text: "Name", value: "name" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "country":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "ISO", value: "iso" },
            { text: "Name", value: "name" },
            { text: "Nice Name", value: "nicename" },
            { text: "ISO3", value: "iso3" },
            { text: "Num Code", value: "numcode" },
            { text: "Phone Code", value: "phonecode" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "city":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Name", value: "name" },
            { text: "Lat", value: "lat" },
            { text: "Long", value: "lng" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "ticketing_type":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Title", value: "title" },
            { text: "Description", value: "description" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "currency":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Country Name", value: "country_nicename" },
            { text: "Currency", value: "currency" },
            { text: "Code", value: "code" },
            { text: "Symbol", value: "symbol" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        case "notification":
          this.headers = [
            {
              text: "ID",
              value: "id",
            },
            { text: "Name", value: "notification_name" },
            { text: "Value", value: "notification_values" },
            { text: "Category", value: "category" },
            { text: "Actions", value: "actions", sortable: false },
          ];
          break;
        default:
          this.snackbar = true;
          this.requestMessage = 'Coming Soon'
          return ''
      }
      item.loading = true;
      this.dialogList = true;
      this.dataMaster = [];
      this.tableLoad = true;
      let uriEncodeLogin = encodeURIComponent(this.$localIp);
      const headers = {
        "Content-Type": "application/json",
        signature: this.$signature,
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        uri: uriEncodeLogin,
      };
      this.formTitle = item.title;
      const request = new Request(concern, {
        method: "GET",
        headers: headers,
        redirect: "follow",
        mode: "cors",
      });
      let res = await fetch(request);
      let resJson = await res.json();
      if ("loading" in item) item.loading = false;
      this.tableLoad = false;
      if (resJson.responseCode == "200") {
        this.dataMaster = resJson.data;
        this.editedItem = Object.assign({}, this.dataMaster[0]);
      } else if(resJson.responseCode == '401'){
        await this.doLogout('Logout')
      } else {
        this.snackbar = true;
        this.requestMessage = resJson.responseMessage;
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
            this.requestMessage = 'Login Failed, please try again'
            window.location.href = decodeURIComponent(uriEncodeLogin)
          } else {
            this.requestMessage = resJson.responseMessage
          }
      }
    },

    editItem(item) {
      this.modelEditForm = Object.assign({}, item);
      this.dialogEdit = true;
    },

    deleteItem(item) {
      this.modelEditForm = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm(title) {
        this.deleteFormLoading = true;
        let formDelete = this.modelEditForm;
        let urls = "";
        let uriEncodeLogin = encodeURIComponent(this.$localIp);
        const headers = {
          "Content-Type": "application/json",
          signature: this.$signature,
          token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
            .token,
          Accept: "*/*",
          "Cache-Control": "no-cache",
          uri: uriEncodeLogin,
        };
        switch (title) {
          case "Identity App":
            urls = "identity_app";
            delete formDelete.code;
            delete formDelete.app_id;
            delete formDelete.name;
            break;
          case "Division":
            urls = "division";
            break;
          case "Bank":
            urls = "bank";
            break;
          case "Country":
            urls = "country";
            break;
          case "City":
            urls = "city";
            break;
          case "Ticketing Topic":
            urls = "ticketing_topic";
            break;
          case "Ticketing Type":
            urls = "ticketing_type";
            break;
          case "Currency":
            urls = "currency";
            break;
          case "Tenant Category":
            urls = "tenant_category";
            break;
          case "Notification":
            urls = "notification";
            break;
          default:
            break;
        }
        const request = new Request(urls, {
          method: "DELETE",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(formDelete),
        });
        let res = await fetch(request);
        let resJson = await res.json();
        this.deleteFormLoading = false;
        this.snackbar = true;
        this.requestMessage = resJson.responseMessage;
        if (resJson.responseCode == "200") {
          this.dialogDelete = false;
          this.getMasterData(urls, { title: title });
        }
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    close() {
      this.dialogEdit = false;
    },

    async save(title) {
      if(this.$refs.editForm.validate()){
        this.editFormLoading = true;
        let urls = "";
        let uriEncodeLogin = encodeURIComponent(this.$localIp);
        const headers = {
          "Content-Type": "application/json",
          signature: this.$signature,
          token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
            .token,
          Accept: "*/*",
          "Cache-Control": "no-cache",
          uri: uriEncodeLogin,
        };
        let edited = this.modelEditForm;
        switch (title) {
          case "Identity App":
            urls = "identity_app";
            edited.category = edited.code.substring(0, 3);
            delete edited.code;
            delete edited.app_id;
            break;
          case "Division":
            urls = "division";
            break;
          case "Bank":
            urls = "bank";
            break;
          case "Country":
            urls = "country";
            break;
          case "City":
            urls = "city";
            break;
          case "Ticketing Topic":
            urls = "ticketing_topic";
            break;
          case "Ticketing Type":
            urls = "ticketing_type";
            break;
          case "Currency":
            urls = "currency";
            delete edited.country_name;
            delete edited.country_nicename;
            break;
          case "Tenant Category":
            urls = "tenant_category";
            break;
          case "Notification":
            urls = "notification";
            break;
          default:
            break;
        }
        console.log("editt", edited);
        const request = new Request(urls, {
          method: "PUT",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(edited),
        });
        let res = await fetch(request);
        let resJson = await res.json();
        this.editFormLoading = false;
        this.snackbar = true;
        this.requestMessage = resJson.responseMessage;
        if (resJson.responseCode == "200") {
          this.dialogEdit = false;
          this.getMasterData(urls, { title: title });
        }
      }
    },
  },
};
</script>

<style>
.shortcutPlace {
  min-width: 15em;
  border-radius: 25px !important;
}
.search {
  right: 2.5em;
  bottom: 2.5em;
}
.v-application .text-start {
  text-align: start !important;
  max-width: 35em !important;
}

.gridLayout3 {
  display: grid;
  width: 100%;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>