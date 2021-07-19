const router = require('express').Router();
const mediaController = require('../../controllers/media.controller');
const validator = require('../../middlewares/validation/validator.middleware');

router.get('/', mediaController.getAll);
router.get('/:id', validator.checkRequestedId, mediaController.getOne);

module.exports = router;