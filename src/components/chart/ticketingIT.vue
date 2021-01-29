<template>
  <v-container fluid>
    <v-data-iterator
      :items="dataTicketingIT"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="usedSortBy"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed :value="false">
                <v-icon color="#f86615">mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed :value="true">
                <v-icon color="#f86615">mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog"
            scrollable
          >
            <template v-slot:default="dialog">
              <v-card>
                <v-card-title class="cardTitle">Ticket Detail</v-card-title>
                <v-card-text class="p-3" style="height: 500px">
                  <v-row class="text-h6">
                    <v-col col="3"> Title </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.title }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Ticket Number </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.ticket_number }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Ticket Date </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.created_at | moment }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> From </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.created_by_name }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Type </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.type_title }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Topic </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.topic_name }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Status </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.status | status }} </v-col>
                  </v-row>
                  <v-row class="text-h6" v-if="onAssigned">
                    <v-col col="3"> Assigned to </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.username }} </v-col>
                  </v-row>
                  <v-row class="text-h6" v-if="onCategory">
                    <v-col col="3"> Category </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                      : {{ detailData.departement_category_name }}
                    </v-col>
                  </v-row>
                  <v-row class="text-h6" v-if="onApproval">
                    <v-col col="3"> Approval Status </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.approval | approval }} </v-col>
                  </v-row>
                  <v-row class="text-h6">
                    <v-col col="3"> Descriptions </v-col>
                    <v-spacer></v-spacer>
                    <v-col> : {{ detailData.descriptions }} </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-space-around">
                  <v-btn
                    v-if="responseAprroval"
                    :loading="onLoadStatusTicketing"
                    text
                    @click="updateStatusTicketing(detailData.id, 'approve')"
                    >Approve</v-btn
                  >
                  <v-btn
                    v-if="responseAprroval"
                    :loading="onLoadStatusTicketing"
                    text
                    @click="updateStatusTicketing(detailData.id, 'reject')"
                    >Reject</v-btn
                  >
                  <v-btn
                    v-if="staffChooseCategory"
                    text
                    @click="openCategory(detailData)"
                    >Choose Category</v-btn
                  >
                  <v-btn
                    v-if="staffGrade"
                    :loading="onLoadResolve"
                    text
                    @click="resolveTicket(detailData.id)"
                    >Resolve</v-btn
                  >
                  <v-btn
                    v-if="assignStaffButton"
                    text
                    @click="openAssignStaff(detailData.id)"
                    >Assign Staff</v-btn
                  >
                  <v-btn text @click="dialog.value = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-dialog v-model="dialog2" max-width="300px">
            <v-card>
              <v-card-title>Assign to</v-card-title>
              <v-card-text>
                <v-select
                  v-model="staffListSelect"
                  :items="staffList"
                  label="Staff list"
                  item-text="employee_name"
                  item-value="employee_id"
                  :disabled="onLoadEmployee"
                  :loading="onLoadEmployee"
                ></v-select>
              </v-card-text>
              <v-card-actions class="justify-space-around">
                <v-btn
                  text
                  :loading="onLoadAssign"
                  @click="assignStaff(idTicketing)"
                  >Assign</v-btn
                >
                <v-btn color="primary" text @click="dialog2 = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog3" max-width="350px">
            <v-card>
              <v-card-title>Choose Department Category</v-card-title>
              <v-card-text>
                <v-select
                  v-model="categoryListSelect"
                  :items="categoryList"
                  label="Category list"
                  item-text="name"
                  item-value="id"
                  :disabled="onLoadCategory"
                  :loading="onLoadCategory"
                ></v-select>
              </v-card-text>
              <v-card-actions class="justify-space-around">
                <v-btn
                  :loading="onLoadAccept"
                  @click="chooseCategory(idTicketingForCategory)"
                  text
                  >Accept</v-btn
                >
                <v-btn color="primary" text @click="dialog3 = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="cardTicket" outlined shaped hover>
              <v-card-title
                class="subheading font-weight-light"
                :class="{ orangeText: sortBy === 'ticket_number' }"
              >
                {{ item.ticket_number }}
                <v-tooltip bottom>
                  <template
                    v-slot:activator="{ on, attrs }"
                    v-if="item.approval == 1"
                  >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      color="success"
                      class="ml-2"
                    >
                      mdi-check
                    </v-icon>
                  </template>
                  <span>Approved</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template
                    v-slot:activator="{ on, attrs }"
                    v-if="item.approval == -1"
                  >
                    <v-icon v-bind="attrs" v-on="on" color="red" class="ml-2">
                      mdi-close
                    </v-icon>
                  </template>
                  <span>Rejected</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template
                    v-slot:activator="{ on, attrs }"
                    v-if="item.approval == 0"
                  >
                    <v-icon v-bind="attrs" v-on="on" class="ml-2">
                      mdi-email-open-outline
                    </v-icon>
                  </template>
                  <span>Open</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="openDetailTicketing(item)"
                      v-bind="attrs"
                      v-on="on"
                      class="ml-2"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
                  <span>Show Detail</span>
                </v-tooltip>
              </v-card-title>
              <v-card-title
                class="title"
                :class="{ orangeText: sortBy === 'title' }"
              >
                {{ item.title }}
              </v-card-title>
              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content
                    :class="{ orangeText: sortBy === 'descriptions' }"
                  >
                    {{ item.descriptions }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content
                    :class="{ orangeText: sortBy === 'created_at' }"
                  >
                    {{ item.created_at | moment }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2 px-4" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn fab dark small class="mr-1 primary" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark small class="ml-1 primary" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
    <v-snackbar :timeout="timeout" v-model="snackbar" rounded="pill" dense>
      {{ anyResponse }}
      <template v-slot:action="{ attrs }">
        <v-btn color="orange" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import * as moment from "moment/moment";

export default {
  props: {
    dataTicketingIT: {
      type: Array,
      default: [],
      required: true,
    },
  },
  data() {
    return {
      snackbar: false,
      anyResponse: "",
      timeout: 2000,
      itemsPerPageArray: [8, 16, 24],
      search: "",
      showDetail: false,
      highGrade: false,
      dialog: false,
      dialog2: false,
      dialog3: false,
      onLoadEmployee: true,
      onLoadCategory: true,
      onLoadAccept: false,
      onLoadResolve: false,
      onLoadStatusTicketing: false,
      onLoadAssign: false,
      staffListSelect: null,
      categoryListSelect: null,
      page: 1,
      itemsPerPage: 8,
      idTicketing: null,
      property: [],
      detailData: {},
      staffList: [],
      categoryList: [],
      sortBy: "created_at",
      staffGrade: false,
      assignStaffButton: false,
      responseAprroval: false,
      staffChooseCategory: false,
      idTicketingForCategory: null,
      onAssigned: false,
      onCategory: false,
      onApproval: false,
      usedProperty: [
        "title",
        "ticket_number",
        "created_at",
        "type",
        "type_title",
        "topic_id",
        "topic_name",
        "status",
        "descriptions",
        "staff_in_charge",
        "username",
      ],
      usedSortBy: ["title", "ticket_number", "descriptions", "created_at"],
      sortDesc: true,
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.dataTicketingIT.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    async openCategory(item) {
      this.dialog3 = true;
      this.categoryListSelect = 0;
      this.categoryList = [];
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        param: JSON.stringify({
          division_id: JSON.parse(
            window.atob(window.localStorage.getItem("loginCred"))
          ).division_id,
        }),
      };
      const request = new Request(
        this.$urlLink + "/backend/dashboardit/departemenCategory",
        {
          method: "GET",
          headers: headers,
          redirect: "follow",
          mode: "cors",
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.onLoadCategory = false;
      if (resJson.responseCode == 200) {
        this.categoryList = resJson.data;
        this.idTicketingForCategory = item.id;
      }
    },
    async chooseCategory(idTicketing) {
      this.onLoadAccept = true;
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
      };
      let bodyCategory = {
        ticket_id: idTicketing,
        ticket_departmen_id: this.categoryListSelect.toString(),
        employee_id: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id,
      };
      const request = new Request(
        this.$urlLink + "/backend/dashboardit/acceptTicketing",
        {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(bodyCategory),
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.anyResponse = resJson.responseMessage;
      this.snackbar = true;
      this.onLoadAccept = false;
      if (resJson.responseCode == 200) {
        this.dialog3 = false;
        this.dialog = false;
      }
    },
    openDetailTicketing(item) {
      this.detailData = [];
      this.detailData = this.dataTicketingIT.find(
        (dataTicketingIT) => dataTicketingIT.id === item.id
      );
      this.dialog = !this.dialog;
      let accountProfileGrade = JSON.parse(
        window.atob(window.localStorage.getItem("loginCred"))
      ).grade;
      // supervisor and above grade will always have the option for accept or reject ticketing
      if (accountProfileGrade <= 4) this.responseAprroval = true;
      // if ticketing approval status is already processed then hide button for accept and reject ticketing
      if (item.approval != "0") this.responseAprroval = false;
      // if status is not yet resolved and user login grade is staff and below then hide resolve button
      if (item.status == "2" && accountProfileGrade > 4)
        this.staffGrade = false;
      // if login user grade is supervisor or above and staff in charge is the login user then show assign staff button
      if (accountProfileGrade <= 4 && item.staff_in_charge == null)
        this.assignStaffButton = true;
      else this.assignStaffButton = false;
      // if login user grade is staff or below and ticket department category is null then show open category button and hide resolve button
      if (accountProfileGrade > 4 && item.ticket_departement_category == null) {
        this.staffChooseCategory = true;
        this.staffGrade = false;
      }
      // if login user grade is staff or below and ticket department category is not null then hide open category button and show resolve button
      if (
        accountProfileGrade > 4 &&
        item.ticket_departement_category != null &&
        item.status != "2"
      ) {
        this.staffChooseCategory = false;
        this.staffGrade = true;
      }

      // check if status is assigned and there is username available then show assigned data
      if (
        (item.status == "1" || item.status == "2") &&
        item.username != "" &&
        item.username != null
      ) {
        this.onAssigned = true;
      }

      // check if departement category exist then show category data
      if (
        item.ticket_departement_category != null &&
        item.ticket_departement_category != "null"
      ) {
        this.onCategory = true;
      }

      // check if approval not 0 then show approval data
      if (item.approval != "0") {
        this.onApproval = true;
      }
    },
    async openAssignStaff(idTicket) {
      this.dialog2 = !this.dialog2;
      this.staffListSelect = 0;
      this.staffList = [];
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        companyProfileId: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).company_id,
      };

      const request = new Request(
        this.$urlLink + "/backend/dashboardit/employee",
        {
          method: "GET",
          headers: headers,
          redirect: "follow",
          mode: "cors",
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.onLoadEmployee = false;
      if (resJson.responseCode == 200) {
        let dataJson = resJson.data;
        let uGrade = JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).grade;
        dataJson = dataJson.filter(function (e) {
          if (uGrade != 4) {
            return parseInt(e.grade) == parseInt(uGrade) + 1;
          } else {
            return e.grade > uGrade;
          }
        });
        this.staffList = dataJson;
        this.idTicketing = idTicket;
      }
    },
    async updateStatusTicketing(idTicketing, response) {
      this.onLoadStatusTicketing = true;
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
      };
      let bodyUpdate = {
        ticket_id: idTicketing,
        action: response,
        employee_id: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id,
        email: JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
          .employee_email,
      };
      const request = new Request(
        this.$urlLink + "/backend/dashboardit/approveTicket",
        {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(bodyUpdate),
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.anyResponse = resJson.responseMessage;
      this.snackbar = true;
      this.onLoadStatusTicketing = false;
      if (resJson.responseCode == 200) {
        this.dialog = false;
      }
    },
    async resolveTicket(idTicketing) {
      this.onLoadResolve = true;
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
      };
      let bodyAssign = {
        ticket_id: idTicketing,
        message: "",
        account_category: "employee",
        staff_id: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id,
        employee_id: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id,
        email: JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
          .employee_email,
      };
      const request = new Request(
        this.$urlLink + "/backend/dashboardit/replyTicketing",
        {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(bodyAssign),
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.anyResponse = resJson.responseMessage;
      this.snackbar = true;
      this.onLoadResolve = false;
      if (resJson.responseCode == 200) {
        this.dialog = false;
      }
    },
    async assignStaff(idTicketing) {
      this.onLoadAssign = true;
      const headers = {
        "Content-Type": "application/json",
        token: JSON.parse(window.atob(window.localStorage.getItem("loginData")))
          .token,
        Accept: "*/*",
        "Cache-Control": "no-cache",
      };
      let bodyAssign = {
        ticket_id: idTicketing,
        staff_id: this.staffListSelect,
        employee_id: JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id,
        email: JSON.parse(window.atob(window.localStorage.getItem("loginCred")))
          .employee_email,
      };
      const request = new Request(
        this.$urlLink + "/backend/dashboardit/assignTicket",
        {
          method: "POST",
          headers: headers,
          redirect: "follow",
          mode: "cors",
          body: JSON.stringify(bodyAssign),
        }
      );
      let res = await fetch(request);
      let resJson = await res.json();
      this.anyResponse = resJson.responseMessage;
      this.snackbar = true;
      this.onLoadAssign = false;
      if (resJson.responseCode == 200) {
        this.dialog2 = false;
        this.dialog = false;
      }
    },
  },
  mounted() {
    let usedProperty = this.usedProperty;
    var checkedKeys = Object.keys(this.dataTicketingIT[0]).filter(function (
      id
    ) {
      return usedProperty.indexOf(id) > -1;
    });
    this.property = checkedKeys;
    if (
      JSON.parse(window.atob(window.localStorage.getItem("loginCred"))).grade >
      4
    ) {
      this.staffGrade = true;
      this.assignStaffButton = false;
      this.responseAprroval = false;
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).format("DD MMMM YYYY");
    },
    status: function (status) {
      let statusResp;
      switch (status) {
        case 1:
        case "1":
          statusResp = "Assigned";
          break;
        case 0:
        case "0":
          statusResp = "Open";
          break;
        case 2:
        case "2":
          statusResp = "Resolved";
          break;
        default:
          statusResp = "No Status";
          break;
      }
      return statusResp;
    },
    approval: function (status) {
      let statusResp;
      switch (status) {
        case 1:
        case "1":
          statusResp = "Approved";
          break;
        case 0:
        case "0":
          statusResp = "Not Confirmed";
          break;
        case -1:
        case "-1":
          statusResp = "Rejected";
          break;
        default:
          statusResp = "No Status";
          break;
      }
      return statusResp;
    },
  },
};
</script>

<style scoped>
.cardTitle {
  background-color: #f86615;
  color: white;
}
.title {
  padding-top: 0px;
}
.orangeText {
  color: #f86615;
}
.cardTicket {
  cursor:auto !important;
}
</style>