<template>
  <v-row>
    <v-col cols="12" v-if="show == true">
      <v-row v-if="!load" justify="end" align="end" dense no-gutters>
        <v-col cols="4" align-self="start">
          
          <v-container fluid>
            <v-select
              v-model="uniqueServices"
              :items="listUniqueServices"
              attach
              label="Show service"
              v-on:change="updateShowServices()"
            ></v-select>
          </v-container>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" align-self="end">
          <v-container fluid>
            <v-select
              v-model="valueSearch"
              :items="itemSearch"
              item-text="display"
              item-value="value"
              attach
              label="Filter performance by"
              v-on:change="updateFilterPreference()"
            ></v-select>
          </v-container>
        </v-col>
      </v-row>
      <v-row v-if="load">
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader
            class="mx-auto mb-3"
            max-width="300"
            type="card"
            elevation="3"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- <v-btn @click="changeUsername()">tes</v-btn> -->

      <div class="service" v-if="!load">
        <v-row>
          <v-col cols="4" v-for="service in listService" :key="service.id">
            <v-card
              class="mb-3 lighten-2"
              :color="service.color"
              :ref="service.id"
              v-show="service.show"
            >
              <v-sheet
                class="v-sheet--offset mx-auto"
                color="cyan"
                elevation="12"
                max-width="calc(100% - 32px)"
              >
                <v-sparkline
                  v-if="cpuStatus"
                  :labels="service.cpuSystem"
                  :value="service.cpuSystem"
                  color="white"
                  line-width="2"
                  padding="16"
                  show-labels
                ></v-sparkline>
                <v-sparkline
                  v-if="eventloopStatus"
                  :labels="service.eventLoopLatency"
                  :value="service.eventLoopLatency"
                  color="white"
                  line-width="2"
                  padding="16"
                  show-labels
                ></v-sparkline>
                <v-sparkline
                  v-if="gcStatus"
                  :labels="service.gcUsed"
                  :value="service.gcUsed"
                  color="white"
                  line-width="2"
                  padding="16"
                  show-labels
                ></v-sparkline>
                <v-sparkline
                  v-if="loopStatus"
                  :labels="service.loopAverage"
                  :value="service.loopAverage"
                  color="white"
                  line-width="2"
                  padding="16"
                  show-labels
                ></v-sparkline>
                <v-sparkline
                  v-if="memoryStatus"
                  :labels="service.physicalUsed"
                  :value="service.physicalUsed"
                  color="white"
                  line-width="2"
                  padding="16"
                  show-labels
                ></v-sparkline>

                <!-- <chart :chartData="service.timeCpu" :options="chartOptions" :xAxis="['process','system']" label="cpu performance"></chart> -->
              </v-sheet>

              <v-card-text class="pt-0">
                <div class="title font-weight-light mt-2 white--text">
                  <mark v-if="service.marks">{{ service.serviceName }}</mark>
                  <div v-if="!service.marks">{{ service.serviceName }}</div>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-icon class="mr-2" small color="white"> mdi-domain </v-icon>
                <span class="caption font-weight-light white--text">{{
                  service.domain
                }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import chart from '@/components/chart/chart'
export default {
  components: {
    chart
  },
  data: () => ({
    itemSearch: [{display:"cpu system",value:'cpu'}, {display:'Event loop latency',value:"eventloop"}, {display:'garbage collection statistics',value:"gc"}, {display:'Event loop timing',value:"loop"}, {display:'memory usage system',value:"memory"}],
    valueSearch: 'cpu',
    uniqueServices: 'all',
    cpuStatus: true,
    eventloopStatus: false,
    gcStatus:false,
    loopStatus:false,
    memoryStatus:false,
    serviceKey:0,
    chartOptions: {
      responsive:true,
      maintainAspectRatio: false,
    },
    filterPreference: null,
    show: true,
  }),
  props: {
    listService : {
      type:Array,
      required:true,
      default:[]
    },
    load:{
      type:Boolean,
      default:true
    },
    listUniqueServices: {
      type:Array,
      required:true,
      default:[]
    }
  },
  methods: {
    async updateShowServices(){
      let list = this.listService;
      list.forEach(element => {
        if(this.uniqueServices == 'all'){
          element.show = true;
        } else {
          if(element.serviceName != this.uniqueServices){
            element.show = false;
          } else {
            element.show = true;
          }
        }
      });
    },
    async updateFilterPreference() {
      this.filterPreference = this.valueSearch;
      let stat = ['cpu','memory','loop','eventloop','gc'];
      stat.forEach(element => {
        if(this.filterPreference != element){
          this[element+'Status'] = false;
        } else {
           this[element+'Status'] = true;
        }
      });
    },
  },
  sockets: {
    updateService(data) {
      console.log('service',data);
      let updatedData = JSON.parse(data);
      if(updatedData.category == 'service'){
        try {
          this.listService.find(listService => listService.id === updatedData.id).marks = true;
          this.listService.find(listService => listService.id === updatedData.id).color = updatedData.status == "off" ? "red" : "green";
          setTimeout(() => {
            this.listService.find(listService => listService.id === updatedData.id).marks = false;
          }, 10000);
          this.$emit('changeBadge','service')
        } catch (error) {
          
        }
        
      }
      
    },
  },
  name: "ServicePerformance",
};
</script>