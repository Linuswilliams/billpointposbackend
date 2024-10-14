const express = require('express');
const { submitPosApplication, getPosApplications, getPOSApplicationDetails } = require('../controllers/posApplication');
const router = express.Router();

router.get('/pos-application/get', getPosApplications);

router.post('/pos-application/post', submitPosApplication);


router.get('/pos-application/details/:id', getPOSApplicationDetails)
module.exports = router;
