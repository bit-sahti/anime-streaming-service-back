const router = require('express').Router();
const mediaController = require('../../controllers/Media.controller');
const validator = require('../middlewares/validation/Validator.middleware');

router.get('/', mediaController.getAll);
router.get('/:id', validator.checkRequestedId, mediaController.getOne);

module.exports = router;