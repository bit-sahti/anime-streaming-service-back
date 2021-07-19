const router = require('express').Router();
const listsController = require('../../controllers/lists.controller');
const validator = require('../../middlewares/validation/validator.middleware');

router.get('/:id/lists', validator.checkRequestedId, listsController.getAllFromUser);
router.post('/:id/lists',  validator.checkListInfo, listsController.createEntry);
router.get('/:id/:listName', validator.checkRequestedId, listsController.getList);

//there should be a verification of user identity
router.put('/entry/:id', validator.checkListInfo, listsController.updateOne);
router.delete('/entry/:id', validator.checkRequestedId, listsController.deleteOne);

module.exports = router;