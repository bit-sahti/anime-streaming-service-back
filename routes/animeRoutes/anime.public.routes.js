const router = require('express').Router();
const animeController = require('../../controllers/Anime.controller');
const validator = require('../middlewares/validation/Validator.middleware');

router.get('/', animeController.getAll);
router.get('/categories/:genre', animeController.getAllFromGenre);
router.get('/:id', validator.checkRequestedId, animeController.getAnimeAndMedia);
// router.post('/new', animeController.createOne);
// router.patch('/:id', animeController.updateOne);
// router.delete(':id', animeController.deleteOne);

module.exports = router;