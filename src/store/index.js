import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    serviceData:[],
    dataTicketing:[],
    dataTicketingIT:[],
    dataTransactionAll:[],
    dataCustomerTransactionSocket:[]
  },
  mutations: {
    // SOCKET_manageService(state,payload) {
    //     payload.sort(function (a, b) {
    //       if (a.serviceName < b.serviceName) {
    //         return -1;
    //       }
    //       if (a.serviceName > b.serviceName) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     state.serviceData = payload;
    // },
    SOCKET_manageTicketing(state,payload){
      state.dataTicketing = payload;
    },
    SOCKET_manageTicketingIT(state,payload){
        let newData;
        let loginCredGrade = JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).grade;
        // this.dataTicketingIT = [];
        let loginCredId = JSON.parse(
          window.atob(window.localStorage.getItem("loginCred"))
        ).employee_id;
        if (loginCredGrade > 4) {
          let data = payload.filter(function (e) {
            return e.staff_in_charge == loginCredId;
          });
          newData = data;
        } else newData = payload;

      state.dataTicketingIT = newData;
    },
    SOCKET_manageTransaction(state,payload){
      state.dataTransactionAll = payload;
    },
    SOCKET_manageCustomerTransaction(state,payload){
      payload = payload.filter(function (e) {
        if (e.transaction_type == "d") {
          (e.icon = "mdi-login"), (e.color = "success");
        } else {
          e.icon = "mdi-logout";
          e.color = "primary";
        }
        return e;
      });
      state.dataCustomerTransactionSocket = payload;
    },
    // SOCKET_updateServiceData(state,payload){
    //   let updatedData = JSON.parse(payload);
    //   try {
    //     state.serviceData.find(listService => listService.id === updatedData.id).marks = true;
    //     state.serviceData.find(listService => listService.id === updatedData.id).color = updatedData.status == "off" ? "red" : "green";
    //     setTimeout(() => {
    //       state.serviceData.find(listService => listService.id === updatedData.id).marks = false;
    //     }, 10000);
    //     // this.$emit('changeBadge',updatedData.category)
    //     this.commit('SOCKET_manageService',state.serviceData);
    //   } catch (error) {
        
    //   }
    // },
    SOCKET_emitService(){
      this._vm.$socket.emit("getService");
    },
    SOCKET_emitTicketing(){
      this._vm.$socket.emit("getTicketing");
    },
    SOCKET_emitTransaction(){
      this._vm.$socket.emit("getTransaction");
    },
    SOCKET_emitCustomerTransaction(){
      this._vm.$socket.emit("getCustomerTransaction");
    }
  },
  actions: {
    SOCKET_connect(state){
      state.commit('SOCKET_emitService');
      state.commit('SOCKET_emitTicketing');
      state.commit('SOCKET_emitTransaction');
      state.commit('SOCKET_emitCustomerTransaction');
    },
    SOCKET_disconnected(state){
      console.log('aa disconnectt');
    },
    SOCKET_toDisconnect(state){
      this._vm.$socket.disconnect()
    },
    // SOCKET_getService(context,data) {
    //   context.commit('SOCKET_manageService',data);
    // },
    SOCKET_getTicketing(context,data) {
      context.commit('SOCKET_manageTicketing',data);
    },
    SOCKET_getTicketingIT(context,data){
      context.commit('SOCKET_manageTicketingIT',data);
    },
    SOCKET_getTransaction(context,data){
      context.commit('SOCKET_manageTransaction',data);
    },
    SOCKET_getCustomerTransaction(context,data){
      context.commit('SOCKET_manageCustomerTransaction',data);
    },
    // SOCKET_updateService(context,data){
    //   context.commit('SOCKET_updateServiceData',data);
    // }
  },
  getters: {
    // getServiceData: state => {
    //   console.log('a',state.serviceData);
    // }
    // getLoginToken: state => {
    //   return JSON.parse(window.atob(state.loginData)).token
    // },
  }
})
