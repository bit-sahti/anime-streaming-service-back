const router = require('express').Router();
const animeController = require('../../controllers/anime.controller');
const validator = require('../../middlewares/validation/validator.middleware');

router.get('/', animeController.searchByTitle);
router.get('/categories/:genre', animeController.getAllFromGenre);
router.get('/:id', validator.checkRequestedId, animeController.getAnimeAndMedia);
// router.post('/new', animeController.createOne);
// router.patch('/:id', animeController.updateOne);
// router.delete(':id', animeController.deleteOne);

module.exports = router;