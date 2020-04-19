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

router.get('/bills', async (req, res) => {
    try {
        console.log(req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills'))
        console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
        console.log(req.headers['content-type'], ">>>>>>>>", "application/xml", "equality", req.headers['content-type'] == "application/xml;")
        if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills')) {
            var billerid = req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message.efbps.banksvcrq.billinqrq.accountid.billerid;
            var envbody = req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message.efbps
            console.log(billerid)
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: billerid
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID = envbody.banksvcrq.rquid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillingAcct = envbody.banksvcrq.billinqrq.accountid.billingacct
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillerId = envbody.banksvcrq.billinqrq.accountid.billerid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.ServiceType = envbody.banksvcrq.billinqrq.ServiceType

            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:calculatecommission')) {
            var reqid = req.body['env:envelope']['env:body']['ins0:calculatecommission'].request1.message.efbps.banksvcrq.rquid
            var envbody = req.body['env:envelope']['env:body']['ins0:calculatecommission'].request1.message.efbps
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99022
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID = reqid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.FeeInqRs.EPayBillRecID = envbody.banksvcrq.feeinqrq.epaybillrecid

            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:confirmpayments')) {
            var reqid = req.body['env:envelope']['env:body']['ins0:confirmpayments'].request1.message.efbps.banksvcrq.rquid
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99023
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.RqUID = reqid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.PmtAdviceRs.PmtRecAdviceStatus.PmtTransId.PmtId = Date.now()

            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        }else{
            res.status(400).send('bad xml');
        }
    } catch (e) {
        res.status(500).send('internal server error ');
    }
});

router.get('/cards', async (req, res) => {

    try {
        console.log(req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills'))
        console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
        console.log(req.headers['content-type'], ">>>>>>>>", "application/xml", "equality", req.headers['content-type'] == "application/xml;")
        if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills')) {
            var billerid = req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message.efbps.banksvcrq.billinqrq.accountid.billerid;
            var envbody = req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message.efbps
            console.log(billerid)
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: billerid
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID = envbody.banksvcrq.rquid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillingAcct = envbody.banksvcrq.billinqrq.accountid.billingacct
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillerId = envbody.banksvcrq.billinqrq.accountid.billerid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.ServiceType = envbody.banksvcrq.billinqrq.ServiceType
            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:calculatecommission')) {
            var reqid = req.body['env:envelope']['env:body']['ins0:calculatecommission'].request1.message.efbps.banksvcrq.rquid
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99957
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID = reqid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.FeeInqRs.EPayBillRecID = envbody.banksvcrq.feeinqrq.epaybillrecid
            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:confirmpayments')) {
            var reqid = req.body['env:envelope']['env:body']['ins0:confirmpayments'].request1.message.efbps.banksvcrq.rquid
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99958
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.RqUID = reqid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.PmtAdviceRs.PmtRecAdviceStatus.PmtTransId.PmtId = Date.now()
            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson);
            res.status(200).contentType('application/XML').send((modifiedres).toString());
        }else{
            res.status(400).send('bad xml');
        }
    } catch (e) {
        res.status(500).send('internal server error ');
    }


});

router.get('/getFees', async (req, res) => {


});

module.exports = router;