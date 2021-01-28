<template>
  <v-row>
    <v-col cols="12" v-if="show == true">
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

      <v-row v-if="!load" justify="end" align="end" dense no-gutters>
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

      <div class="service" v-if="!load">
        <v-row>
          <v-col
            cols="4"
            v-for="service in listService"
            :key="service.id"
          >
            <v-card
              class="mb-3 lighten-2"
              :color="service.color"
              :key="service.id"
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
export default {
  data: () => ({
    itemSearch: [{display:"cpu system",value:'cpu'}, {display:'Event loop latency',value:"eventloop"}, {display:'garbage collection statistics',value:"gc"}, {display:'Event loop timing',value:"loop"}, {display:'memory usage system',value:"memory"}],
    valueSearch: "cpu",
    show: true,
    load: false,
    cpuStatus: true,
    eventloopStatus: false,
    gcStatus:false,
    loopStatus:false,
    memoryStatus:false,
    filterPreference: null,
  }),
  props: {
    listService : {
      type:Array,
      required:true,
      default:[]
    }
  },
  methods:{
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
      console.log("dashboard");
      let updatedData = JSON.parse(data);
      if(updatedData.category == 'dashboard'){
        try {
          this.listService.find(listService => listService.id === updatedData.id).marks = true;
          this.listService.find(listService => listService.id === updatedData.id).color = updatedData.status == "off" ? "red" : "green";
          setTimeout(() => {
            this.listService.find(listService => listService.id === updatedData.id).marks = false;
          }, 10000);
          this.$emit('changeBadge','dashboard')
        } catch (error) {
          
        }
      }
      
    },
  },
};
</script>

<style>
</style>