const router = require('express').Router();

const animeRoutes = require('./animeRoutes/anime.public.routes');
const mediaRoutes = require('./mediaRoutes/media.public.routes');
const authRoutes = require('./authRoutes/auth.routes');
const userListRoutes = require('./userRoutes/userLists.routes');

const protector = require('../middlewares/protection/routeProtector.middleware');

router.use('/auth', authRoutes);
router.use('/animes', animeRoutes);
router.use('/media', mediaRoutes);

router.use(protector.userExclusive);

router.use('/users', userListRoutes);

module.exports = router;