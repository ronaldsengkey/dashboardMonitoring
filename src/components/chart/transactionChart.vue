<template>
  <v-card-text>
    <v-row>
      <v-col cols="10">
        <v-sheet color="rgba(0, 0, 0, .12)">
          <v-card-text class="text-left">
            <div class="subtitle-1 font-weight-thin">Transaction Chart</div>
          </v-card-text>
          <chart
            :chartData="transactionAll"
            :options="chartOptions"
            :xAxis="xAxisTransactionAll"
            label="Transaction Count"
            :key="keyTransactionAll"
          ></chart>
          <v-row>
            <v-col>
              <v-card-text class="text-left">
                {{ pending }}%
                <div class="subtitle-1 font-weight-thin">
                  Pending Transaction
                </div>
              </v-card-text>
            </v-col>
            <v-col>
              <v-card-text class="text-left" style="width: auto !important">
                {{ success }}%
                <div class="subtitle-1 font-weight-thin">
                  Success Transaction
                </div>
              </v-card-text>
            </v-col>
            <v-col>
              <v-card-text class="text-left" style="width: auto !important">
                {{ failed }}%
                <div class="subtitle-1 font-weight-thin">
                  Failed Transaction
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="2">
        <v-tabs vertical grow center-active style="min-height: 100%">
          <v-tab @click="updateCharts('all')"> All </v-tab>
          <v-tab @click="updateCharts('topup')"> {{ dataTopup }}% Topup</v-tab>
          <v-tab @click="updateCharts('billing')">
            {{ dataBilling }}% Billing
          </v-tab>
          <v-tab @click="updateCharts('payment')">
            {{ dataWallet }}% Wallet
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import chart from "@/components/chart/chart";
export default {
  components: {
    chart,
  },
  props: {
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
  }),
};
</script>

<style>
</style>