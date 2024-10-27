const express=require('express');
const router=express.Router();
const bitcoinservices=require('../../Services/cryptoservice/bitcoin');
const litecoinservices=require('../../Services/cryptoservice/Litecoin');
const etheriumservice=require('../../Services/cryptoservice/etherium');
const avalancheservice=require('../../Services/cryptoservice/Avalanche');
const polkadotservice=require('../../Services/cryptoservice/Polkadot');


router.get('/getbitcoinweeklyprice',bitcoinservices.getBitcoinWeeklyPrice);
router.get('/getlitecoindata',litecoinservices.getLitecoinWeeklyPrice);
router.get('/getetheriumdata',etheriumservice.getEtheriumWeeklyPrice);
router.get('/getavalanchedata',avalancheservice.getAvalancheWeeklyPrice);
router.get('/getpolkadotdata',polkadotservice.getPolkadotWeeklyPrice);


module.exports=router;