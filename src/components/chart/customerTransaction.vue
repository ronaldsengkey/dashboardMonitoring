<template>
  <v-container
    class="containerCT"
  >
    <v-timeline dense clipped>
      <v-timeline-item
        class="mb-4"
        fill-dot
        medium
        :color="data.color"
        v-for="data in dataCustomerTransaction"
        :key="data.id"
      >
        <template v-slot:icon>
          <v-icon color="white">{{data.icon}}</v-icon>
        </template>
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
                >{{ data.name }} telah {{data.color | colorDefine }}  {{data.category | categoryString}} sebesar
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
    colorDefine: function(color){
      let string ='';
      switch(color){
        case 'success':
          string += 'menerima ';
          break;
        case 'primary':
          string += 'melakukan ';
          break;
      }
      return string;
    },
    categoryString:function(category){
      let string = ' ';
      switch(category){
        case 'Topup':
        case 'Payment':
        case 'Wallet':
          string += ' transaksi ' + category;
          break;
        case 'Refund':
          string += ' refund';
          break;
        case 'Withdraw':
          string += ' withdraw';
          break;
        default:
          break;
      }
      return string;
    }
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