const express = require('express')
const router = express.Router();
const { loginAdmin, sendEmailOtpForVerification, verifyOtpSentToUser, changeForgotPwdAdmin, getSession, createAdmin, logoutUserSession, getUserInfo } = require('../controllers/account');

// Route to create an admin account
router.post('/create-admin', createAdmin);

router.post('/signin-admin', loginAdmin);
router.post('/admin/logout', logoutUserSession);
// router.post('/user/get/info', getUserInfoFromDb);
router.post('/admin/otp/email/send', sendEmailOtpForVerification);
router.post('/admin/otp/verify', verifyOtpSentToUser);
router.patch('/admin/update/password', changeForgotPwdAdmin);
router.get('/admin/session/:email', getSession);

router.get('/admin/info/:email', getUserInfo);




module.exports = router;
