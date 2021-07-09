const router = require('express').Router();

const animeRoutes = require('./animeRoutes/anime.public.routes');
const mediaRoutes = require('./mediaRoutes/media.public.routes');

router.use('/animes', animeRoutes);
router.use('/media', mediaRoutes);

module.exports = router;