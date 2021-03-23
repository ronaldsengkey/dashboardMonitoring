<template>
  <v-card color="basil">
    <v-tabs
      v-model="tab"
      slider-color="success"
      background-color="transparent"
      color="basil"
      grow
    >
      <!-- <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab> -->

      <v-tab>
        <v-badge :color="serviceBadge" v-if="serviceTab" dot>Service</v-badge>
      </v-tab>
      <v-tab :disabled="disabled">
        <v-badge :color="dashboardBadge" v-if="dashboardTab" dot
          >Dashboard</v-badge
        >
      </v-tab>
      <v-tab :disabled="disabled">
        <v-badge :color="databaseBadge" v-if="databaseTab" dot
          >Database</v-badge
        >
      </v-tab>
      <v-tab :disabled="disabled"> Chart </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card color="basil" flat min-width="100%" width="100%">
          <v-card-text
            ><ServicePerformance
              :listService="listOfService"
              :listUniqueServices="uniqueListServices"
              :load="load"
              @changeBadge="changeBadge($event)"
            ></ServicePerformance
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card color="basil" flat min-width="100%" width="100%">
          <v-card-text
            ><DashboardPerformance
              :listService="listOfDashboardService"
              @changeBadge="changeBadge($event)"
            ></DashboardPerformance
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card color="basil" flat min-width="100%" width="100%">
          <v-card-text
            ><DatabasePerformance
              :listService="listOfDatabaseService"
              @changeBadge="changeBadge($event)"
            ></DatabasePerformance
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card color="basil" flat min-width="100%" width="100%">
          <v-card-text
            ><LandingChart
              :success="success"
              :failed="failed"
              :pending="pending"
              :dataTopup="dataTopup"
              :dataBilling="dataBilling"
              :dataWallet="dataWallet"
              :transactionAll="transactionAll"
              :transactionSocketAll="transactionSocketAll"
              :xAxisTransactionAll="xAxisTransactionAll"
              :keyTransactionAll="keyTransactionAll"
              :ticketingOpenCloseCount="ticketingOpenCloseCount"
              :xAxisTicketingOpenClose="xAxisTicketingOpenClose"
              :dataTicket="dataTicket"
              :keyTicketing="keyTicketing"
              :dataTicketingIT="dataTicketingIT"
              :dataCustomerTransaction="dataCustomerTransaction"
              :dataCustomerTransactionSocket="dataCustomerTransactionSocket"
              @updateCharts="updateTransaction($event)"
            ></LandingChart
          ></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import LandingChart from "@/views/LandingChart";
import ServicePerformance from "@/views/performance/ServicePerformance";
import DashboardPerformance from "@/views/performance/DashboardPerformance";
import DatabasePerformance from "@/views/performance/DatabasePerformance";

import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import { store } from "@/store/index";

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: process.env.VUE_APP_URL_SOCKET,
    options: { path: "/configService" },
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

export default {
  props: {
    serviceTab: {
      type: Boolean,
      default: true,
    },
    dashboardTab: {
      type: Boolean,
      default: true,
    },
    databaseTab: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      disabled: true,
      tab: null,
      //Service
      listOfService: [],
      listOfDashboardService: [],
      listOfDatabaseService: [],
      load: true,
      uniqueListServices:['all'],

      //Ticketing open and close
      ticketingOpenCloseCount: [],
      xAxisTicketingOpenClose: [],
      keyTicketing: 0,

      //Transaction Chart
      keyTransactionAll: 0,
      transactionAll: [],
      xAxisTransactionAll: [],
      ticketingData: [],
      currentState: "all",
      success: 0,
      failed: 0,
      pending: 0,
      dataTopup: 0,
      dataBilling: 0,
      dataWallet: 0,

      // Ticketing IT
      // dataTicketingIT: [],

      // Customer Transaction
      dataCustomerTransaction: [],

      //Badge
      serviceBadge: "",
      dashboardBadge: "",
      databaseBadge: "",
    };
  },
  methods: {
    changeBadge(concern) {
      if (concern == "dashboard") {
        this.dashboardBadge = "red";
        setTimeout(() => {
          this.dashboardBadge = "";
        }, 10000);
      } else if (concern == "service") {
        this.serviceBadge = "red";
        setTimeout(() => {
          this.serviceBadge = "";
        }, 10000);
      } else if (concern == "database") {
        this.databaseBadge = "red";
        setTimeout(() => {
          this.databaseBadge = "";
        }, 10000);
      }
    },
    manageServicePerformance(data, concern = "service") {
      data.forEach(function (element, index) {
        if (element.status == "on") {
          element["color"] = "green";
        } else {
          element["color"] = "red";
        }
        element.show = true;
        element.marks = false;
        element.cpuSystem = [];
        element.eventLoopLatency = [];
        element.gcUsed = [];
        element.loopAverage = [];
        element.physicalUsed = [];

        if (element.performance.length > 0) {
          let elePerform = element.performance;
          elePerform.forEach((element2) => {
            if (Object.keys(JSON.parse(element2.cpuProfiling)).length != 0) {
              // console.log("dalam", JSON.parse(element2.cpuProfiling),index);
              try {
                element.cpuSystem.push(
                  parseFloat(
                    JSON.parse(
                      JSON.parse(element2.cpuProfiling).cpu
                    ).system.toFixed(2)
                  )
                );
                element.eventLoopLatency.push(
                  parseFloat(
                    JSON.parse(
                      JSON.parse(element2.cpuProfiling).eventloop
                    ).latency.avg.toFixed(2)
                  )
                );
                element.gcUsed.push(
                  parseFloat(
                    JSON.parse(JSON.parse(element2.cpuProfiling).gc).used
                  )
                );
                element.loopAverage.push(
                  parseFloat(
                    JSON.parse(
                      JSON.parse(element2.cpuProfiling).loop
                    ).average.toFixed(2)
                  )
                );
                element.physicalUsed.push(
                  parseFloat(
                    JSON.parse(JSON.parse(element2.cpuProfiling).memory)
                      .physical_used
                  )
                );
              } catch (error) {}
            }
          });
        }
      });
      data = data.filter(function (e) {
        return e.category == concern;
      });
      this.cpuKey += 1;
      this.load = false;
      this.disabled = false;
      return data;
    },

    updateTransaction(filter) {
      this.currentState = filter;
      let xArr = [];
      let xData = [];
      let ticketData = this.ticketingData;
      let all = 0;
      let allData = 0;

      let alls = 0;
      ticketData.forEach((element) => {
        if (element.name == "all") {
          alls = element.value.all;
        }
      });
      ticketData.forEach((element) => {
        if (element.name == "topup") {
          this.dataTopup = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        } else if (element.name == "billing") {
          this.dataBilling = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        } else if (element.name == "payment") {
          this.dataWallet = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        }
      });

      ticketData.forEach((element) => {
        if (element.name == filter) {
          Object.entries(element.value).forEach(function (data) {
            allData += data[1];
            if (data[0] != "all") {
              xArr.push(data[0]);
              xData.push(data[1]);
            } else {
              all = data[1];
            }
          });
          this.success = (
            100 -
            ((all - element.value.success) / all) * 100
          ).toFixed(1);
          this.failed = (
            100 -
            ((all - element.value.failed) / all) * 100
          ).toFixed(1);
          this.pending = (
            100 -
            ((all - element.value.pending) / all) * 100
          ).toFixed(1);
          this.dataEach = (100 - ((allData - all) / all) * 100).toFixed(1);
        }
      });
      this.xAxisTransactionAll = xArr;
      this.transactionAll = xData;
      this.keyTransactionAll += 1;
    },
  },
  computed: {
    // listOfService() {
    //   let data = this.$store.state.serviceData;
    //   data = this.manageServicePerformance(data);
    //   if (data.length > 0) {
    //     this.load = false;
    //     this.disabled = false;
    //   }
    //   this.updateServiceComponent += 1;
    //   return data;
    // },
    // listOfDashboardService() {
    //   let data = this.$store.state.serviceData;
    //   data = this.manageServicePerformance(data,"dashboard");
    //   this.updateDashboardComponent += 1;
    //   return data;
    // },
    // listOfDatabaseService() {
    //   let data = this.$store.state.serviceData;
    //   data = this.manageServicePerformance(data,"database");
    //   this.updateDatabaseComponent += 1;
    //   return data;
    // },
    dataTicket(){
      let data = this.$store.state.dataTicketing;
      this.xAxisTicketingOpenClose = [];
      this.ticketingOpenCloseCount = [];
      data.forEach((element) => {
        this.xAxisTicketingOpenClose.push(element.name);
        this.ticketingOpenCloseCount.push(parseInt(element.count));
      });
      this.keyTicketing += 1;
    },
    dataTicketingIT(){
      return this.$store.state.dataTicketingIT;
    },
    transactionSocketAll(){
      let data = this.$store.state.dataTransactionAll;
      this.xAxisTransactionAll = [];
      this.ticketingData = [];
      let alls = 0;
      data.forEach((element) => {
        if (element.name == "all") {
          alls = element.value.all;
        }
      });
      data.forEach((element) => {
        if (element.name == "topup") {
          this.dataTopup = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        } else if (element.name == "billing") {
          this.dataBilling = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        } else if (element.name == "payment") {
          this.dataWallet = (
            100 -
            ((alls - element.value.all) / alls) * 100
          ).toFixed(1);
        }
      });
      this.ticketingData = data;
      this.updateTransaction(this.currentState);
    },
    dataCustomerTransactionSocket(){
      let data = this.$store.state.dataCustomerTransactionSocket;
      this.dataCustomerTransaction = [];
      data = data.filter(function (e) {
        if (e.transaction_type == "d") {
          (e.icon = "mdi-login"), (e.color = "success");
        } else {
          e.icon = "mdi-logout";
          e.color = "primary";
        }
        return e;
      });
      this.dataCustomerTransaction = data;
    }
  },
  mounted(){
    this.$store.dispatch('SOCKET_emitAll');
  },
  sockets: {
    async getService(data){
      this.listOfService = [];
      this.listOfDashboardService = [];
      this.listOfDatabaseService = [];
      try {
        data.sort(function (a, b) {
          if (a.serviceName < b.serviceName) {
            return -1;
          }
          if (a.serviceName > b.serviceName) {
            return 1;
          }
          return 0;
        });
        this.listOfService = this.manageServicePerformance(data);
        const unique = [...new Set(this.listOfService.map(item => item.serviceName))];
        this.uniqueListServices = this.uniqueListServices.concat(unique);
        this.listOfDashboardService = this.manageServicePerformance(data,'dashboard');
        this.listOfDatabaseService = this.manageServicePerformance(data,'database');
      } catch (error) {
        this.$store.commit('SOCKET_emitService'); 
      }
    }
    // async getTicketingIT(data) {
    //   console.log("get ticketing IT", data);
    //   let loginCredGrade = JSON.parse(
    //     window.atob(window.localStorage.getItem("loginCred"))
    //   ).grade;
    //   this.dataTicketingIT = [];
    //   let loginCredId = JSON.parse(
    //     window.atob(window.localStorage.getItem("loginCred"))
    //   ).employee_id;
    //   if (loginCredGrade > 4) {
    //     data = data.filter(function (e) {
    //       return e.staff_in_charge == loginCredId;
    //     });
    //     this.dataTicketingIT = data;
    //   } else this.dataTicketingIT = data;
    // },

    // async getCustomerTransaction(data) {
    //   console.log("get customer transaction", data);
    //   this.dataCustomerTransaction = [];
    //   data = data.filter(function (e) {
    //     if (e.transaction_type == "d") {
    //       (e.icon = "mdi-login"), (e.color = "success");
    //     } else {
    //       e.icon = "mdi-logout";
    //       e.color = "primary";
    //     }
    //     return e;
    //   });
    //   this.dataCustomerTransaction = data;
    // },

    // async getTicketing(data) {
    //   console.log("get ticketing", data);
    //   this.xAxisTicketingOpenClose = [];
    //   this.ticketingOpenCloseCount = [];
    //   data.forEach((element) => {
    //     this.xAxisTicketingOpenClose.push(element.name);
    //     this.ticketingOpenCloseCount.push(parseInt(element.count));
    //   });
    //   this.keyTicketing += 1;
    // },

    // async getTransaction(data) {
    //   console.log("get transaction", data);
    //   this.transactionAll = [];
    //   this.xAxisTransactionAll = [];
    //   this.ticketingData = [];
    //   let alls = 0;
    //   data.forEach((element) => {
    //     if (element.name == "all") {
    //       alls = element.value.all;
    //     }
    //   });
    //   data.forEach((element) => {
    //     if (element.name == "topup") {
    //       this.dataTopup = (
    //         100 -
    //         ((alls - element.value.all) / alls) * 100
    //       ).toFixed(1);
    //     } else if (element.name == "billing") {
    //       this.dataBilling = (
    //         100 -
    //         ((alls - element.value.all) / alls) * 100
    //       ).toFixed(1);
    //     } else if (element.name == "payment") {
    //       this.dataWallet = (
    //         100 -
    //         ((alls - element.value.all) / alls) * 100
    //       ).toFixed(1);
    //     }
    //   });
    //   this.ticketingData = data;
    //   this.updateTransaction(this.currentState);
    // },
  },
  components: {
    LandingChart,
    ServicePerformance,
    DashboardPerformance,
    DatabasePerformance,
  },
  name: "TabLanding",
};
</script>