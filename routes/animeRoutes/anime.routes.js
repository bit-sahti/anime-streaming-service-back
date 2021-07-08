const router = require('express').Router();
const animeController = require('../../controllers/anime.controller')

router.get('/', animeController.getAll);
router.get('/:genre', animeController.getAllFromGenre);
router.get('/:id', animeController.getOne)
// router.post('/new', animeController.createOne);
// router.patch('/:id', animeController.updateOne);
// router.delete(':id', animeController.deleteOne);

module.exports = router;