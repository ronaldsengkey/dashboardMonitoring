<template>
  <v-col>
    <v-card
      class="mx-auto text-center"
      elevation="0"
      flat
      outlined
      color="white"
    >
      <v-row>
        <v-col cols="12">
          <draggable tag="v-layout">
            <v-card shaped outlined hover class="my-5 transactionChart">
              <v-card-title class="primary white--text">
                Transaction Chart
              </v-card-title>
              <TransactionChart
                :success="success"
                :failed="failed"
                :pending="pending"
                :dataTopup="dataTopup"
                :dataBilling="dataBilling"
                :dataWallet="dataWallet"
                :transactionAll="transactionAll"
                :xAxisTransactionAll="xAxisTransactionAll"
                :keyTransactionAll="keyTransactionAll"
                :ticketingOpenCloseCount="ticketingOpenCloseCount"
                :xAxisTicketingOpenClose="xAxisTicketingOpenClose"
                :keyTicketing="keyTicketing"
                @updateCharts="updateCharts($event)"
              />
            </v-card>
            <v-row class="my-5">
              <v-col cols="6">
                <v-card shaped outlined hover>
                  <v-card-title class="primary white--text">
                    Customer Activity
                  </v-card-title>
                  <v-divider></v-divider>
                  <CustomerTransaction
                    :dataCustomerTransaction="dataCustomerTransaction"
                  />
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card shaped outlined hover>
                  <v-card-title class="primary white--text">
                    Ticketing open & close chart
                  </v-card-title>
                  <v-divider></v-divider>
                  <TicketingStatus
                    :ticketingOpenCloseCount="ticketingOpenCloseCount"
                    :xAxisTicketingOpenClose="xAxisTicketingOpenClose"
                    :keyTicketing="keyTicketing"
                  />
                </v-card>
              </v-col>
            </v-row>
            <v-card shaped outlined hover class="my-5 ticketingIT">
              <v-card-title class="primary white--text">
                Ticketing Queue
              </v-card-title>
              <TicketingIT :dataTicketingIT="dataTicketingIT" />
            </v-card>
          </draggable>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { Bar } from "vue-chartjs";
import chart from "@/components/chart/chart";
import TicketingStatus from "@/components/chart/ticketingStatus";
import TransactionChart from "@/components/chart/transactionChart";
import TicketingIT from "@/components/chart/ticketingIT";
import CustomerTransaction from "@/components/chart/customerTransaction";
import draggable from "vuedraggable";

const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];

export default {
  components: {
    chart,
    TicketingStatus,
    TransactionChart,
    TicketingIT,
    CustomerTransaction,
    draggable,
  },
  props: {
    // open and close ticket
    ticketingOpenCloseCount: {
      type: Array,
      default: [],
      required: true,
    },
    xAxisTicketingOpenClose: {
      type: Array,
      default: [],
      required: true,
    },
    keyTicketing: {
      type: Number,
      default: 0,
      required: true,
    },
    // transaction chart
    transactionAll: {
      type: Array,
      default: [],
      required: true,
    },
    xAxisTransactionAll: {
      type: Array,
      default: [],
      required: true,
    },
    keyTransactionAll: {
      type: Number,
      default: 0,
      required: true,
    },

    // transaction count
    success: {
      type: String,
      default: 0,
      required: true,
    },
    failed: {
      type: String,
      default: 0,
      required: true,
    },
    pending: {
      type: String,
      default: 0,
      required: true,
    },
    dataTopup: {
      type: String,
      default: 0,
      required: true,
    },
    dataBilling: {
      type: String,
      default: 0,
      required: true,
    },
    dataWallet: {
      type: String,
      default: 0,
      required: true,
    },

    dataTicketingIT: {
      type: Array,
      defult: [],
      required: true,
    },

    dataCustomerTransaction: {
      type: Array,
      defult: [],
      required: true,
    },
  },
  methods: {
    updateCharts(filter) {
      this.$emit("updateCharts", filter);
    },
  },
  data: () => ({
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    },
    value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760,
      762,
      160,
      555,
      222,
      511,
      812,
      900,
      100,
    ],
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: "round",

    gradient: gradients[5],
    // value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    gradientDirection: "top",
    gradients,
    fill: false,
    type: "trend",
    autoLineWidth: false,
  }),
  name: "LandingChart",
};
</script>

<style scoped>
.transactionChart {
  cursor: auto !important;
}
.ticketingIT {
  cursor: auto !important;
}
</style>