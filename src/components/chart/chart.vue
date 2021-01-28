<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    label: {
      type: String,
    },
    xAxis: {
      type: Array,
    },
    chartData: {
      type: Array,
    },
    options: {
      type: Object,
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.xAxis,
        datasets: [
          {
            label: this.label,
            backgroundColor: "#f86615",
            data: this.chartData,
          },
        ],
      },
      this.options
    );
  },
};
</script>