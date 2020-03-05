const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];
const data = require('./../../../../test.json')
const fs = require('fs');
var readline = require('readline');
var {
  sequelize
} = require('./../../indexModels');
const { Op } = require("sequelize");


var parser = require('fast-xml-parser');
//default options need not to set
var options = {
  attributeNamePrefix: "@_",
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
  if (!req.body.request.data.requestmap.item.value) {
    var beeres = await beePayload.findOne({ where :{
      account_id: req.body.request.data.serviceaccountid,
      totalAmount: req.body.request.data.totalamount,
      amount:  req.body.request.data.amount
    }  
  })
  }else {
    var beeres = await beePayload.findOne({ where :{
      account_id: req.body.request.data.serviceaccountid,
      params: req.body.request.data.requestmap.item.value,
      totalAmount: req.body.request.data.totalamount,
      amount:  req.body.request.data.amount
    }  
  })
  }
    if(beeres && beeres.action == "RR"){
      console.log(beeres.response)
      res.status(200).contentType('application/XML').send(beeres.response);
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