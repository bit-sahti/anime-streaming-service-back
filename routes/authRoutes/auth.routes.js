const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const validator = require('../middlewares/validation/validator.middleware')

router.use(validator.checkAuthInfo)

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;


