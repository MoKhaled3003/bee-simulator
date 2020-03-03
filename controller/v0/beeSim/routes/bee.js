const express = require('express');
const router = express.Router();
const beePayload = require("../../indexModels")["beePayload"];

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
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  arrayMode: false
};


router.get('/inquiry', async (req, res) => {

});


router.post('/payment', async (req, res) => {
  var myInterface = readline.createInterface({
    input: fs.createReadStream('XMLrequest.txt')
  });

  myInterface.on('line', async function (line) {
    var jsonObj = parser.parse(line,options);
    console.log(jsonObj.Request.data.serviceAccountId)
 
    let beereq = await beePayload.findOne({ where :{account_id: jsonObj.Request.data.serviceAccountId}})
    if(beereq){
      beereq.request = line;
      console.log(beereq)
      await beereq.save({fields: ['request']});
    }
  });
  res.status(200).send()
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