const express = require('express');
const router = express.Router();
const beeRouter = require('./beeSim/routes/bee');  

router.use('/bee', beeRouter);

router.get('/', async (req, res) => {    
    res.send(`V0`);
});

module.exports = router;