const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const validator = require('../middlewares/validation/validator.middleware')

// router.use(validator.checkAuthInfo)

router.post('/signup', validator.checkSignUpInfo, authController.signup);
router.post('/login', validator.checkLoginInfo, authController.login);

module.exports = router;


