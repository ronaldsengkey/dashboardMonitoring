<template>
  <chart
    :chartData="ticketingOpenCloseCount"
    :options="chartOptions"
    :xAxis="xAxisTicketingOpenClose"
    label="ticketing count"
    :key="keyTicketing"
  ></chart>
</template>

<script>
import chart from "@/components/chart/chart";
export default {
  components: {
    chart,
  },
  props: {
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