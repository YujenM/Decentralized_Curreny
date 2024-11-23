const express = require('express');
const router = express.Router();


const Predictionsercive = require('../../Services/PredictionServices/Prediction');

router.post('/InsertPrediction', Predictionsercive.InsertPrediction);

router.get('/getcryptoprediction', Predictionsercive.getcryptoprediction);

router.get('/getcryptopredictiondata/:cryptoid', Predictionsercive.getcryptopredictiondata);

module.exports = router;