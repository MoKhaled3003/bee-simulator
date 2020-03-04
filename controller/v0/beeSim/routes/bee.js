const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];
const data = require('./../../../../test.json')
const fs = require('fs');
var readline = require('readline');

var parser = require('fast-xml-parser');
//default options need not to set
var options = {
  attributeNamePrefix : "@_",
  attrNodeName: "attr", //default is 'false'
  textNodeName : "#text",
  ignoreAttributes : false,
  ignoreNameSpace : false,
  allowBooleanAttributes : true,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: false,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: true,
  arrayMode: false
};


router.get('/inquiry', async (req, res) => {
  data.forEach(async element => {
    var jsonObj = parser.parse(element.request_payload,options);
    console.log(jsonObj.Request.data.requestMap.item.value)
    console.log(jsonObj.Request.data.totalAmount)

    let beereq = new beePayload({
      account_id: jsonObj.Request.data.serviceAccountId,
      params: (jsonObj.Request.data.requestMap.item.value).toString(),
      amount: jsonObj.Request.data.totalAmount,
      request: element.request_payload,
      response: element.response_payload,
      action : "RR",
      used : "NO"
    })
    await beereq.save();
  });
  res.status(200).send()
});


router.post('/payment', async (req, res) => {
  console.log(req.body)
  let beereq = await beePayload.findOne({ where :{
    account_id: req.body.request.data.serviceaccountid,
    params: req.body.request.data.requestmap.item.value,
    amount: req.body.request.data.totalamount
  }})
  if(beereq && beereq.action == "RR"){
    console.log(beereq.response)
    res.status(200).contentType('application/XML').send(beereq.response);
  }

});

router.get('/list', async (req, res) => {


});

router.get('/status', async (req, res) => {


});

function validateXML(jsonreq) {
  var parser = new Parser(defaultOptions);
  var xml = parser.parse(jsonreq);
  return xml;

};

module.exports = router;