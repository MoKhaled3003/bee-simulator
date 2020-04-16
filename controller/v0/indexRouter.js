const express = require('express');
const router = express.Router();
const beeRouter = require('./beeSim/routes/bee'); 
const efinanceRouter = require('./beeSim/routes/efinance');  

router.use('/bee', beeRouter);
router.use('/efinance', efinanceRouter);

router.get('/', async (req, res) => {    
    res.send(`V0`);
});

module.exports = router;