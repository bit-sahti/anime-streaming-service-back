require('dotenv').config({ path: '../.env'});

const mongoose = require('mongoose');
const Anime = require('../models/Anime.model');
const Media = require('../models/Media.model');

const animes = [
    {
        title: 'Anime 1',
        description: 'Anime de ação e drama',
        genres: ['Ação', 'Drama'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    },
    {
        title: 'Anime 2',
        description: 'Anime de comédia e slice of life',
        genres: ['Comédia', 'Slice of Life'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    },
    {
        title: 'Anime 3',
        description: 'Anime mahou shoujo de aventura e comédia',
        genres: ['Aventura', 'Mahou Shoujo'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    },
    {
        title: 'Anime 4',
        description: 'Anime de ação e drama',
        genres: ['Ação', 'Drama'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    },
    {
        title: 'Anime 5',
        description: 'Anime de comédia e slice of life',
        genres: ['Comédia', 'Slice of Life'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    },
    {
        title: 'Anime 6',
        description: 'Anime mahou shoujo de aventura e comédia',
        genres: ['Aventura', 'Mahou Shoujo'],
        episodesNumber: 3,
        score: 7.8,
        audio: ['Inglês']
    }
]

const animeMedia = [
    {
        mediaType: 'episode',
        link: 'A link',
        season: 1,
        number: 1,
        title: 'O começo',
        description: 'Começo da jornada.'
    },
    {
        mediaType: 'episode',
        link: 'A link',
        season: 1,
        number: 2,
        title: 'O meio',
        description: 'Meio da jornada.'
    },
    {
        mediaType: 'episode',
        link: 'A link',
        season: 1,
        number: 3,
        title: 'O fim',
        description: 'Fim da jornada.'
    },
]


const seedAnimes = async animes => await Anime.create(animes);

const seedMedia = async (animes, media) => {
    const mediaCreation = animes.map(async (anime) => {
        const episodes = media.map(episode => {
            episode.anime = anime._id;

            return episode;
        })

        await Media.create(episodes)
    })

    await Promise.all(mediaCreation)
}

const createDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await mongoose.connection.dropDatabase();

        const createdAnimes = await seedAnimes(animes);

        await seedMedia(createdAnimes, animeMedia);

        console.log('DB successfully created')
    }

    catch(err) {
        console.log(err)
    }

    finally {
       await mongoose.connection.close()
    }
}

createDB();