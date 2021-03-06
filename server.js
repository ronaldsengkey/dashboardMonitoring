const express = require('express');
var app = express();
const got = require('got');
var bodyParser = require('body-parser')
require('dotenv').config();
require('express-namespace');

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
app.use("/it", staticFileMiddleware);

app.get("/", (_req, res) => {
    res.redirect('/it');
});

app.get("/it", (_req, res) => {
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
app.post("/it/login", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'authentication/signin?continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{version:req.headers.version,signature:req.headers.signature}})
    console.log('login res',callData.responseCode);
    res.send(callData);
});

app.get("/it/employeeData", async (req, res) => {
    let callData = await gotCall({url:'authentication/getData?v='+process.env.VUE_APP_VERSION+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'&continue='+req.headers.uri+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('employee data res',callData.responseCode);
    res.send(callData);
});

app.get("/it/checkToken", async (req, res) => {
    let callData = await gotCall({url:'authentication/identifier?v='+process.env.VUE_APP_VERSION+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'&continue='+req.headers.uri+'',headerExtra:{signature:req.headers.signature,token:req.headers.token,Authorization:req.headers.authorization}})
    console.log('employee data res',callData.responseCode);
    res.send(callData);
});

app.post("/it/logout", async (req, res) => {
    let callData = await gotCall({method:'post',url:'authentication/logout?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('logout res',callData.responseCode)
    res.send(callData);
});

// LOG CRUD
app.get("/it/logCrud", async (req, res) => {
    let callData = await gotCall({url:'backend/logcrud',headerExtra:{signature:req.headers.signature,token:req.headers.token,secretKey:req.headers.secretkey,param:req.headers.param}})
    console.log('log crud res',callData.responseCode);
    res.send(callData);
});

// LOG ACTIVITY
app.get("/it/logActivity", async (req, res) => {
    let callData = await gotCall({url:'log/log',headerExtra:{signature:req.headers.signature,token:req.headers.token,secretKey:req.headers.secretkey,param:req.headers.param}})
    console.log('log activty res',callData.responseCode);
    res.send(callData);
});

// TICKETING
app.get("/it/assignStaffData", async (req, res) => {
    let callData = await gotCall({url:'backend/dashboardit/employee',headerExtra:{token:req.headers.token,companyProfileId:req.headers.companyprofileid}})
    console.log('assign staff data res',callData.responseCode);
    res.send(callData);
});

app.post("/it/assignStaff", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/assignTicket',headerExtra:{token:req.headers.token}})
    console.log('assign staff post res',callData);
    res.send(callData);
});

app.post("/it/approveTicket", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/approveTicket',headerExtra:{token:req.headers.token}})
    console.log('approve ticket res',callData.responseCode);
    res.send(callData);
});

app.get("/it/departmentCategory", async (req, res) => {
    let callData = await gotCall({url:'backend/dashboardit/departemenCategory',headerExtra:{token:req.headers.token,param:req.headers.param}})
    console.log('department category res',callData.responseCode);
    res.send(callData);
});

app.post("/it/chooseCategory", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/acceptTicketing',headerExtra:{token:req.headers.token}})
    console.log('choose category res',callData.responseCode);
    res.send(callData);
});

app.post("/it/resolveTicket", async (req, res) => {
    let callData = await gotCall({method:'post',data:{body: JSON.stringify(req.body)},url:'backend/dashboardit/replyTicketing',headerExtra:{token:req.headers.token}})
    console.log('resolve ticket res',callData.responseCode);
    res.send(callData);
});

// MASTER DATA -> IDENTITY APP
app.get("/it/identity_app", async (req, res) => {
    let callData = await gotCall({method:'get',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/identity_app", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'authentication/data/master/identityApp?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('identity app delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> DIVISION
app.get("/it/division", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/division", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/division?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('division delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> BANK
app.get("/it/bank", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank get res',callData.responseCode)
    if(callData.responseCode == '200') { callData.data.forEach(element => { element['codes'] = element.code;delete element.code;});}
    res.send(callData);
});

app.post("/it/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/bank", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/bank?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('bank delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> COUNTRY
app.get("/it/country", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/country", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/country?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('country delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> CITY
app.get("/it/city", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/city", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/city?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('city delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> CURRENCY
app.get("/it/currency", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/currency", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/currency?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('currency delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TICKETING TYPE
app.get("/it/ticketing_type", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/ticketing_type", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/ticketingType?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('ticketingType delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TICKETING TOPIC
app.get("/it/ticketing_topic", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/ticketing_topic", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/topicCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('topicCategory delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> TENANT
app.get("/it/tenant_category", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/tenant_category", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/tenantCategory?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('tenantCategory delete res',callData.responseCode)
    res.send(callData);
});

// MASTER DATA -> Notification
app.get("/it/notification", async (req, res) => {
    let callData = await gotCall({method:'get',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification get res',callData.responseCode)
    res.send(callData);
});

app.post("/it/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'post',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification post res',callData.responseCode)
    res.send(callData);
});

app.put("/it/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'put',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification put res',callData.responseCode)
    res.send(callData);
});

app.delete("/it/notification", async (req, res) => {
    let callData = await gotCall({data:{body: JSON.stringify(req.body)},method:'delete',url:'backend/data/master/notification?v='+process.env.VUE_APP_VERSION+'&continue='+req.headers.uri+'&flowEntry='+process.env.VUE_APP_FLOWENTRY+'',headerExtra:{signature:req.headers.signature,token:req.headers.token}})
    console.log('notification delete res',callData.responseCode)
    res.send(callData);
});