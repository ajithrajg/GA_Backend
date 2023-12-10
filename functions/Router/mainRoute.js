
const express = require('express');
const router = express.Router();
const CSPController = require('../Controller/CSPController');   
const MainController = require('../Controller/MainController');
const AuthController = require('../Controller/AuthController');
const manInTheMiddle = require('../Middleware/manInTheMiddle');

router.get('/ReadCSPReports',  CSPController.ReadCSPReports);
  
router.post('/AddCSPReports', CSPController.AddCSPReport);
  
router.put('/UpdateCSPReport',  CSPController.UpdateCSPReport);
  
router.delete('/DeleteCSPReport', manInTheMiddle.securityGuard, CSPController.DeleteCSPReport);
  
router.get('/GetEntitlements',  MainController.entitlements);
  
router.post('/WriteFeedback', MainController.feedback);
  
router.post('/Login', manInTheMiddle.verifyFresher, AuthController.login);
  
router.get('/Logout', [manInTheMiddle.checkBlackListed, manInTheMiddle.securityGuard], AuthController.logout);

module.exports = router;
