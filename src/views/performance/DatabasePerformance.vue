<template>
  <v-row>
    <v-col cols="12" v-if="show == true">
      <div class="service">
        <v-row>
          <v-col cols="4" v-for="service in listService" :key="service.id">
            <v-card
              class="mb-3 lighten-2"
              :color="service.color"
              :ref="service.id"
            >
            
              <v-sheet
                class="v-sheet--offset mx-auto"
                color="cyan"
                elevation="12"
                max-width="calc(100% - 32px)"
              >
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
    data:() => ({
        show:true,
    }),
    props: {
      listService : {
        type:Array,
        required:true,
        default:[]
      }
    },
    sockets:{
        updateService(data) {
          console.log('database');
          let updatedData = JSON.parse(data);
          if(updatedData.category == 'database'){
            try {
              this.listService.find(listService => listService.id === updatedData.id).marks = true;
              this.listService.find(listService => listService.id === updatedData.id).color = updatedData.status == "off" ? "red" : "green";
              setTimeout(() => {
                this.listService.find(listService => listService.id === updatedData.id).marks = false;
              }, 10000);
              this.$emit('changeBadge','database')
            } catch (error) {
              
            }
          }
        },
    }
}
</script>

<style>

</style>