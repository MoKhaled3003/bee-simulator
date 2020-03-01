const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];

const fs = require('fs');
var readline = require('readline');

var he = require('he')
var Parser = require("fast-xml-parser").j2xParser;
//default options need not to set
var defaultOptions = {
  cdataTagName: "__cdata",
  cdataPositionChar: "\\c"
};



router.get('/inquiry', async (req, res) => {

});


router.post('/payment', async (req, res) => {
  var arr = [];
  var myInterface = readline.createInterface({
    input: fs.createReadStream('XMLreqjson.json')
  });

  myInterface.on('line', async function (line) {
    var jsonObj = JSON.parse(line);
    console.log(jsonObj)
    if(!jsonObj.Request.data.requestMap.item.value)
    {
      jsonObj.Request.data.requestMap.item.value = null;
    }
    let beereq = new beePayload({
      account_id: jsonObj.Request.data.serviceAccountId,
      params: jsonObj.Request.data.requestMap.item.value,
      amount: jsonObj.Request.data.totalAmount
    })
    arr.push(beereq)
    await beereq.save();
  });
  res.status(200).send(arr)
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