const router = require('express').Router();

const animeRoutes = require('./animeRoutes/anime.routes');

router.use('/animes', animeRoutes);

module.exports = router;