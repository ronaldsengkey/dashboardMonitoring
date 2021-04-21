const express = require('express');
var app = express();
const got = require('got');
var bodyParser = require('body-parser')
require('dotenv').config()

const port = 8109;
let defHeaders = {'Content-Type': 'application/json',"Accept": "*/*","Cache-Control": "no-cache"};
let gotReq = got.extend({
    prefixUrl: process.env.VUE_APP_URL_LINK + '/',
	responseType: 'json',
    resolveBodyOnly: true,
});

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');

app.use(bodyParser.json());

// 1st call for unredirected requests 
app.use(staticFileMiddleware);

app.get("/", (_req, res) => {
    try {
      res.sendFile('/dist/index.html');
    } catch (error) {
      res.json({ success: false, message: "Something went wrong" });
    }
});

// 2nd call for redirected requests
app.use(staticFileMiddleware);

app.listen(port, function () {
  console.log('app listening on port '+port+'!');
});

async function gotCall({url,data = {},method = 'get',headerExtra = {}}){
    let callback;
    return new Promise(async function(resolve,reject){
        if(headerExtra != {}) gotReq = gotReq.extend({headers: Object.assign(defHeaders,headerExtra)})
        else gotReq = gotReq.extend({headers: defHeaders})

        try {
            switch(method){
                case 'get':
                    callback = await gotReq.get(url)
                    break;
                case 'post':
                    callback = await gotReq.post(url,data)
                    break;
                case 'put':
                    callback = await gotReq.put(url,data)
                    break;
                case 'delete':
                    callback = await gotReq.delete(url,data)
                    break;
                default:
                    break;
            }
            resolve(callback)
        } catch (error) {
            console.log('a',error.response.body,data)
        }
        
    })
}

// CREDENTIAL
app.post("/login", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'authentication/signin?continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{version:req.headers.version,signature:req.headers.signature}})
    console.log('login res',callData.responseCode);
    res.send(callData);
});

app.get("/employeeData", async (req, res) => {
    let callData = await gotCall({url:'authentication/getData?v='+process.env.VUE_APP_VERSION+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'&continue='+req.headers.uri+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('employee data res',callData.responseCode);
    res.send(callData);
});

app.get("/checkToken", async (req, res) => {
    let callData = await gotCall({url:'authentication/identifier?v='+process.env.VUE_APP_VERSION+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'&continue='+req.headers.uri+'',headerExtra:{signature:req.headers.signature,token:req.headers.token,Authorization:req.headers.authorization}})
    console.log('employee data res',callData.responseCode);
    res.send(callData);
});

app.post("/logout", async (req, res) => {
    let callData = await gotCall({method:'post',url:'authentication/logout?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('logout res',callData.responseCode)
    res.send(callData);
});

// LOG CRUD
app.get("/logCrud", async (req, res) => {
    let callData = await gotCall({url:'backend/logcrud',headerExtra:{signature:req.headers.signature,token:req.headers.token,secretKey:req.headers.secretkey,param:req.headers.param}})
    console.log('log crud res',callData.responseCode);
    res.send(callData);
});

// TICKETING
app.get("/assignStaffData", async (req, res) => {
    let callData = await gotCall({url:'backend/dashboardit/employee',headerExtra:{token:req.headers.token,companyProfileId:req.headers.companyprofileid}})
    console.log('assign staff data res',callData.responseCode);
    res.send(callData);
});

app.post("/assignStaff", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/assignTicket',headerExtra:{token:req.headers.token}})
    console.log('assign staff post res',callData);
    res.send(callData);
});

app.post("/approveTicket", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/approveTicket',headerExtra:{token:req.headers.token}})
    console.log('approve ticket res',callData.responseCode);
    res.send(callData);
});

app.get("/departmentCategory", async (req, res) => {
    let callData = await gotCall({url:'backend/dashboardit/departemenCategory',headerExtra:{token:req.headers.token,param:req.headers.param}})
    console.log('department category res',callData.responseCode);
    res.send(callData);
});

app.post("/chooseCategory", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/acceptTicketing',headerExtra:{token:req.headers.token}})
    console.log('choose category res',callData.responseCode);
    res.send(callData);
});

app.post("/resolveTicket", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/replyTicketing',headerExtra:{token:req.headers.token}})
    console.log('resolve ticket res',callData.responseCode);
    res.send(callData);
});

// MASTER DATA -> IDENTITY APP
app.get("/identity_app", async (req, res) => {
    let callData = await gotCall({method:'get',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app get res',callData.responseCode)
    res.send(callData);
});

app.post("/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app post res',callData.responseCode)
    res.send(callData);
});

app.put("/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app put res',callData.responseCode)
    res.send(callData);
});

app.delete("/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> DIVISION
app.get("/division", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division get res',callData.responseCode)
    res.send(callData);
});

app.post("/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division post res',callData.responseCode)
    res.send(callData);
});

app.put("/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division put res',callData.responseCode)
    res.send(callData);
});

app.delete("/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> BANK
app.get("/bank", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank get res',callData.responseCode)
    res.send(callData);
});

app.post("/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank post res',callData.responseCode)
    res.send(callData);
});

app.put("/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank put res',callData.responseCode)
    res.send(callData);
});

app.delete("/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> COUNTRY
app.get("/country", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country get res',callData.responseCode)
    res.send(callData);
});

app.post("/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country post res',callData.responseCode)
    res.send(callData);
});

app.put("/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country put res',callData.responseCode)
    res.send(callData);
});

app.delete("/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> CITY
app.get("/city", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city get res',callData.responseCode)
    res.send(callData);
});

app.post("/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city post res',callData.responseCode)
    res.send(callData);
});

app.put("/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city put res',callData.responseCode)
    res.send(callData);
});

app.delete("/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> CURRENCY
app.get("/currency", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency get res',callData.responseCode)
    res.send(callData);
});

app.post("/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency post res',callData.responseCode)
    res.send(callData);
});

app.put("/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency put res',callData.responseCode)
    res.send(callData);
});

app.delete("/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TICKETING TYPE
app.get("/ticketing_type", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType get res',callData.responseCode)
    res.send(callData);
});

app.post("/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType post res',callData.responseCode)
    res.send(callData);
});

app.put("/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType put res',callData.responseCode)
    res.send(callData);
});

app.delete("/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TICKETING TOPIC
app.get("/ticketing_topic", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory get res',callData.responseCode)
    res.send(callData);
});

app.post("/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory post res',callData.responseCode)
    res.send(callData);
});

app.put("/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory put res',callData.responseCode)
    res.send(callData);
});

app.delete("/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TENANT
app.get("/tenant_category", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory get res',callData.responseCode)
    res.send(callData);
});

app.post("/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory post res',callData.responseCode)
    res.send(callData);
});

app.put("/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory put res',callData.responseCode)
    res.send(callData);
});

app.delete("/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> Notification
app.get("/notification", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification get res',callData.responseCode)
    res.send(callData);
});

app.post("/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification post res',callData.responseCode)
    res.send(callData);
});

app.put("/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification put res',callData.responseCode)
    res.send(callData);
});

app.delete("/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification delete res',callData.responseCode)
    res.send(callData);
});