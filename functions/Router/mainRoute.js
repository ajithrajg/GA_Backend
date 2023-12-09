
const express = require('express');
const router = express.Router();
const CSPController = require('../Controller/CSPController');   
const MainController = require('../Controller/MainController');
const AuthController = require('../Controller/AuthController');
const manInTheMiddle = require('../Middleware/manInTheMiddle');

router.get('/ReadCSPReports', manInTheMiddle.securityGuard, CSPController.ReadCSPReports);
  
router.post('/AddCSPReports', manInTheMiddle.securityGuard, CSPController.AddCSPReport);
  
router.put('/UpdateCSPReport', manInTheMiddle.securityGuard, CSPController.UpdateCSPReport);
  
router.delete('/DeleteCSPReport', manInTheMiddle.securityGuard, CSPController.DeleteCSPReport);
  
router.get('/GetProducts', manInTheMiddle.securityGuard, MainController.entitlements);
  
router.post('/WriteFeedback', manInTheMiddle.securityGuard, MainController.feedback);
  
router.post('/Login', manInTheMiddle.verifyFresher, AuthController.login);
  
router.get('/Logout', [manInTheMiddle.checkBlackListed, manInTheMiddle.securityGuard], AuthController.logout);

module.exports = router;
