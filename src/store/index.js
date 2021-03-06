import Vue from 'vue'
import Vuex from 'vuex'
import * as moment from "moment/moment";

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    serviceData:[],
    dataTicketing:[],
    dataTicketingIT:[],
    dataTransactionAll:[],
    dataCustomerTransactionSocket:[],
    dataLog:[],
    dataActivityLog:[]
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
    },
    getLogMutate(state,payload){
      state.dataLog = payload;
    },
    getLogActivityMutate(state,payload){
      state.dataActivityLog = payload;
    }
  },
  actions: {
    SOCKET_connect(state){
      // state.commit('SOCKET_emitService');
      // state.commit('SOCKET_emitTicketing');
      // state.commit('SOCKET_emitTransaction');
      // state.commit('SOCKET_emitCustomerTransaction');
    },
    SOCKET_disconnected(state){
      console.log('aa disconnectt');
    },
    SOCKET_toDisconnect(state){
      this._vm.$socket.disconnect()
    },
    SOCKET_emitAll(state){
      state.commit('SOCKET_emitService');
      state.commit('SOCKET_emitTicketing');
      state.commit('SOCKET_emitTransaction');
      state.commit('SOCKET_emitCustomerTransaction');
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
    async getLogList(context,data){
      const headers = {
        'Content-Type': 'application/json',
        'signature': data.signature,
        token: JSON.parse(window.atob(window.localStorage.getItem('loginData'))).token,
        "Accept": "*/*",
        secretkey:'',
        "Cache-Control": "no-cache",
        'param': JSON.stringify({"module": ""})

      }
      const request = new Request(
        'logCrud',
        {
          method: "GET",
          headers:headers,
        }
      );
      let res = await fetch(request)
      let resJson = await res.json();
      if(resJson.responseCode == 200 || resJson.responseCode == '200')
      context.commit('getLogMutate',resJson.data)
      else if(resJson.responseCode == 401 || resJson.responseCode == '401')
      context.commit('getLogMutate',401);
      else 
      context.commit('getLogMutate',[]);
    },
    async getLogActivityList(context,data){
      const headers = {
        'Content-Type': 'application/json',
        'signature': data.signature,
        token: JSON.parse(window.atob(window.localStorage.getItem('loginData'))).token,
        "Accept": "*/*",
        secretkey:'',
        "Cache-Control": "no-cache",
        'param': JSON.stringify({"accessorCategory": data.category})

      }
      const request = new Request(
        'logActivity',
        {
          method: "GET",
          headers:headers,
        }
      );
      let res = await fetch(request)
      let resJson = await res.json();
      if(resJson.responseCode == 200 || resJson.responseCode == '200')
      context.commit('getLogActivityMutate',resJson.data)
      else if(resJson.responseCode == 401 || resJson.responseCode == '401')
      context.commit('getLogActivityMutate',401);
      else 
      context.commit('getLogActivityMutate',[]);
    },
    async emptyLogActivityList(context){
      context.commit('getLogActivityMutate',[]);
    },
    async emptyLogList(context){
      context.commit('getLogMutate',[]);
    }
  },
  getters: {
    getMomentedLog: state => {
      var rpCurrencyFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      let dataLog = state.dataLog
      if(dataLog != 401){
        dataLog = dataLog.sort().reverse()
        dataLog.forEach(element => {
          delete element['id'];
          delete element['created_date'];
          delete element['created_at'];
          delete element['crud_id'];
          // element.created_at = moment(element.created_at).format("DD MMM YYYY");
          try {
            if(element.description.includes('(amount)')){
              let getDesc = element.description.split('(amount)');
              getDesc[1] = rpCurrencyFormatter.format(getDesc[1]);
              element.description = getDesc[0] + ' (amount) ' + getDesc[1]
            }
          } catch (error) {
            
          }
          return element;
        });
      }
      
      return dataLog;
    },
    getActivityLog: state => {
      let dataActivityLog = state.dataActivityLog
      if(dataActivityLog != 401){
        dataActivityLog.forEach(element => {
          delete element['accessorAddress'];
          delete element['accessorId'];
          delete element['createdAt'];
          delete element['createdTime'];
          delete element['_id'];
          delete element['__v'];
          return element;
        });
      }
      return dataActivityLog;
    }
  }
})
