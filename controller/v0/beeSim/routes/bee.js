const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];
var {
  sequelize
} = require('./../../indexModels');
const { Op } = require("sequelize");


var parser = require('fast-xml-parser');
var Parser = require("fast-xml-parser").j2xParser;

//default options need not to set
var options = {
  attributeNamePrefix: "",
  attrNodeName: "attr", //default is 'false'
  textNodeName: "#text",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: true,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: false,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: true,
  arrayMode: false
};


router.get('/inquiry', async (req, res) => {
  
});

router.post('/payment', async (req, res) => {
console.log(req.body)
  if(req.body.request.data.serviceaccountid){
    var beeres = await beePayload.findOne({ where :{
      account_id: req.body.request.data.serviceaccountid
    }})  
  }
  console.log(beeres.params)
  if (Object.keys(req.body.request.data.requestmap) == false) {
    console.log('no request map')
    if(!beeres.params&& beeres.action == "RR"){
      var beeresjson = parser.parse((beeres.response).toString(),options);

    console.log(beeresjson)
    beeresjson.Response.data.transactionId = req.body.request.data.transactionid
    console.log(beeresjson.Response.data.transactionId)

    var xmlparser = new Parser(options);
    var modifiedres = xmlparser.parse(beeresjson);
     res.status(200).contentType('application/XML').send(modifiedres);
    }else{
    res.status(400).contentType('application/XML').send('bad xml params ');
    }
    }  
  else if (req.body.request.data.requestmap.item.value == beeres.params  && beeres.action == "RR" ){
    console.log('with request map')
    var beeresjson = parser.parse((beeres.response).toString(),options);

    console.log(beeresjson)
    beeresjson.Response.data.transactionId = req.body.request.data.transactionid
    console.log(beeresjson.Response.data.transactionId)

    var xmlparser = new Parser(options);
    var modifiedres = xmlparser.parse(beeresjson);
     res.status(200).contentType('application/XML').send(modifiedres);
  }else{
    res.status(400).contentType('application/XML').send('bad xml params ');

  }
});

router.get('/list', async (req, res) => {
  

});

router.get('/status', async (req, res) => {


});

module.exports = router;