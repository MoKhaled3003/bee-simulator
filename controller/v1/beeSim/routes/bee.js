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


router.get('/inquiry', async (req, res) => {

});

router.post('/payment', async (req, res) => {
  try {
    console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
    if (req.body.request.data.serviceaccountid) {
      var beeres = await beePayload.findOne({
        where: {
          account_id: req.body.request.data.serviceaccountid
        }
      })
      var beeresjson = parser.parse((beeres.response).toString(), options);
      var beereqjson = parser.parse((beeres.request).toString(), options);

      var amount = parseFloat(req.body.request.data.amount)
      var totalAmount = parseFloat(req.body.request.data.totalamount)
      console.log(amount)
      console.log(totalAmount)
      
      if( beeres.amount != amount  || beeres.totalAmount != totalAmount  ){
       return res.status(400).contentType('application/XML').send('service charge is nott correct');
      }
      if (typeof req.body.request.data.requestmap === 'string') {
        console.log('no request map')
        if (!beeres.params) {
          console.log('null param')
          beeresjson.Response.data.transactionId = req.body.request.data.transactionid
          var xmlparser = new Parser(options);
          var modifiedres = xmlparser.parse(beeresjson);
          res.status(200).contentType('application/XML').send(modifiedres);
        }else{
          res.status(400).contentType('application/XML').send('Key is not matching');
        }
      } else if(typeof req.body.request.data.requestmap === 'object'){
        console.log('there is request map')
        // if (req.body.request.data.requestmap.item.value == '') {
        //   req.body.request.data.requestmap.item.value = null
        //   console.log('after edit request', req.body.request.data.requestmap.item.value)
        // }
          if(req.body.request.data.requestmap.item.key == beereqjson.Request.data.requestMap.item.key ){
            beeresjson.Response.data.transactionId = req.body.request.data.transactionid
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(beeresjson);
            res.status(200).contentType('application/XML').send(modifiedres);
        }else{
          res.status(400).contentType('application/XML').send('Key is not matching');
        }
      }
    } else {
      res.status(400).contentType('application/XML').send('there is no service id tag');
    }

  } catch (e) {
    res.status(404).send('there is no service in DB');
  }
});

router.get('/list', async (req, res) => {


});

router.get('/status', async (req, res) => {


});

module.exports = router;