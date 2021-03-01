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