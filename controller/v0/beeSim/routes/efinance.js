const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];
var {
  sequelize
} = require('./../../indexModels');
const {
  Op
} = require("sequelize");
const util = require('util')



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
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: true,
  arrayMode: false
};

router.post('/payment', async (req, res) => {
 
});

router.get('/inquire', async (req, res) => {

  console.log(req.headers['content-type'])
  console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
  console.log(req.headers['content-type'], ">>>>>>>>", "application/xml",
    "equality", req.headers['content-type'] == "application/xml;")
  // try {
  //   if (req.headers['content-type'] == "application/xml;" && req.body.request.data.serviceaccountid) {
  //     var beeres = await beePayload.findOne({
  //       where: {
  //         account_id: req.body.request.data.serviceaccountid
  //       }
  //     })
  //     var beeresjson = parser.parse((beeres.response).toString(), options);

  //     console.log(beeresjson)
  //     beeresjson.Response.data.transactionId = req.body.request.data.transactionid
  //     console.log(beeresjson.Response.data.transactionId)

  //     var xmlparser = new Parser(options);
  //     var modifiedres = xmlparser.parse(beeresjson);
  //     res.status(200).contentType('application/XML').send(modifiedres);
  //   } else {
  //     res.status(400).contentType('application/XML').send('bad xml content type or service id ');
  //   }
  // } catch (e) {
  //   res.status(500).send('internal server erorr');
  // }

});

router.get('/getFees', async (req, res) => {


});

module.exports = router;