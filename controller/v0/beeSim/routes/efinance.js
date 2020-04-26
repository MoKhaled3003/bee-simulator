const express = require('express');
const router = express.Router();
const _ = require('lodash')
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

router.post('/bills', async (req, res) => {
    try {
        console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
        if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills')) {
            var xmlparser = new Parser(options);
            var efinanceReq = parser.parse((req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message).toString(), options);

            var envbody = efinanceReq.EFBPS
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99007
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID = envbody.BankSvcRq.RqUID
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillingAcct = envbody.BankSvcRq.BillInqRq.AccountId.BillingAcct
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.AccountId.BillerId = envbody.BankSvcRq.BillInqRq.AccountId.BillerId
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.BillInqRs.BillRec.BillInfo.ServiceType = envbody.BankSvcRq.BillInqRq.ServiceType

            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message.EFBPS.BankSvcRs.RqUID)

            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "enquireBillsResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);


        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:calculatecommission')) {

            var efinanceReq = parser.parse((req.body['env:envelope']['env:body']['ins0:calculatecommission'].request1.message).toString(), options);
            var envbody = efinanceReq.EFBPS

            var reqid = envbody.BankSvcRq.RqUID
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99022
                }
            })
            var efinanceResjson = parser.parse((efinanceRes.response).toString(), options);
            console.log(util.inspect(efinanceResjson, false, null, true /* enable colors */ ))
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID = reqid
            efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.FeeInqRs.EPayBillRecID = envbody.BankSvcRq.FeeInqRq.EpayBillRecID

            console.log(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message.EFBPS.BankSvcRs.RqUID)
            var xmlparser = new Parser(options);
            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "calculateCommissionResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);
        } else if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:confirmpayments')) {
            var efinanceReq = parser.parse((req.body['env:envelope']['env:body']['ins0:confirmpayments'].request1.message).toString(), options);
            var envbody = efinanceReq.EFBPS

            var reqid = envbody.BankSvcRq.RqUID
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
            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "confirmPaymentsResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);
        } else {
            res.status(400).send('bad xml');
        }
    } catch (e) {
        res.status(500).send('service account id is not in database ');
    }
});

router.get('/cards', async (req, res) => {

    try {
        console.log(req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills'))
        console.log(util.inspect(req.body, false, null, true /* enable colors */ ))
        console.log(req.headers['content-type'], ">>>>>>>>", "application/xml", "equality", req.headers['content-type'] == "application/xml;")
        if (req.body['env:envelope']['env:body'].hasOwnProperty('ins0:enquirebills')) {
            var envbody = req.body['env:envelope']['env:body']['ins0:enquirebills'].request1.message.efbps
            var efinanceRes = await beePayload.findOne({
                where: {
                    account_id: 99007
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
            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:enquireBillsResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "enquireBillsResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);
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
            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:calculateCommissionResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "calculateCommissionResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);
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
            var modifiedres = xmlparser.parse(efinanceResjson['soapenv:Envelope']['soapenv:Body']['p375:confirmPaymentsResponse'].result.message);
            var efinanceResFinal = await getpayload(modifiedres, "confirmPaymentsResponse")
            res.status(200).contentType('application/XML').send(efinanceResFinal);
        } else {
            res.status(400).send('bad xml');
        }
    } catch (e) {
        res.status(500).send('internal server error ');
    }


});

router.get('/getFees', async (req, res) => {


});

async function getpayload(msg, action) { //payload of efinance 
    msg = msg.toString('utf8');
    var escaped_msg = _.escape(msg);
    return `<?xml version="1.0"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Header/>
        <soapenv:Body>
            <p375:${action} xmlns:p375="urn:BillPaymentService/types">
                <result>
                    <message>${escaped_msg}</message>
                    <receiverID>0024</receiverID>
                    <signature>H5MjpFW35m3BbMUgjOrJkIsx0hH86aop/4RwubdEPaGHh99/HC59oFBwP12NfzA9Rd4Gq7H4tl38 Xx0eY6NESt90OSBRDwkF0sbqisAYORh3x3RzhOVx8NR47vHjl1Yyn6pUYRUGuVsWAayYhUuaxd2O ipI4nvBYoubfJl30v1Y=</signature>
                </result>
            </p375:${action}>
        </soapenv:Body>
    </soapenv:Envelope>
    `;
}

module.exports = router;