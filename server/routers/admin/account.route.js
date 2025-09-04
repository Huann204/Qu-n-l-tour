const router = require("express").Router();

const accountController = require("../../controllers/admin/account.controller");
const accountValidates = require("../../validates/admin/account.validate");
const authMiddleware = require("../../middlewares/admin/auth.middleware");


router.get('/login', accountController.login);

router.post('/login', 
  accountValidates.loginPost,
  accountController.loginPost);

router.get('/register', accountController.register);

router.post('/register',
  accountValidates.registerPost,
  accountController.registerPost);

router.get('/register-initial', accountController.registerInitial);

router.get('/forgot-password', accountController.forgotPassword);

router.post('/forgot-password',
  accountValidates.forgotPasswordPost, 
  accountController.forgotPasswordPost
);

router.get('/otp-password', accountController.otpPassword);

router.post('/otp-password', 
  accountController.otpPasswordPost
);

router.get('/reset-password', accountController.resetPassword);

router.post('/reset-password',
  authMiddleware.verifyToken, 
  accountController.resetPasswordPost);

router.post('/logout', accountController.logoutPost);

module.exports = router;