<template>
  <v-container
    class="containerCT"
  >
    <v-timeline dense clipped>
      <v-timeline-item
        class="mb-4"
        small
        fill-dot
        :icon="data.icon"
        :color="data.color"
        v-for="data in dataCustomerTransaction"
        :key="data.id"
      >
        <v-row justify="space-between">
          <v-col cols="7">
            <v-row no-gutters dense>
              <v-col
                ><v-chip
                  class="white--text ml-0 mb-0 pb-0 text-center primary"
                  label
                  small
                >
                  {{ data.category }}
                </v-chip></v-col
              >
            </v-row>
            <v-row>
              <v-col
                >{{ data.name }} telah melakukan transaksi sebesar
                {{ data.nominal | convert }}</v-col
              >
            </v-row>
          </v-col>
          <v-col class="text-center" cols="5">
            <v-row>
              <v-col></v-col>
            </v-row>
            <v-row>
              <v-col>
                {{ data.created_at | moment }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
import * as moment from "moment/moment";

var rpCurrencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default {
  props: {
    dataCustomerTransaction: {
      type: Array,
      default: [],
      required: true,
    },
  },
  data() {
    return {
      icon: "mdi-login",
    };
  },
  filters: {
    moment: function (date) {
      return moment(date).format("DD MMM YYYY");
    },
    convert: function (balance) {
      return rpCurrencyFormatter.format(balance);
    },
  },
};
</script>

<style scoped>
.containerCT {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  max-width: 600px; 
  max-height: 400px; 
  overflow-y: auto
}
.containerCT::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>