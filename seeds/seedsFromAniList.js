require('dotenv').config();

const mongoose = require('mongoose');
const axios = require('axios');

const Anime = require('../models/Anime.model');
const Media = require('../models/Media.model');

class AniListHandler {
    constructor() {
        this.method = 'POST'
        this.url = 'https://graphql.anilist.co/',
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        this.query = `
            query($perPage: Int) {
                Page(page: 1, perPage: $perPage) {
                    media(type: ANIME, isAdult: false) {
                        title {
                            romaji
                            english
                        }
                        description
                        genres
                        coverImage {
                            extraLarge
                            large
                            medium
                        }
                        averageScore
                        format
                        streamingEpisodes {
                            title
                            url
                        }
                        episodes
                    }
                }
            }
        
        `;
    }

    mapGenres(genres) {
        return genres.map(genre => {
            return genre.split(/[-\s]/).map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
        })
    }

    mapAnimes(animes) {
        return animes.map(anime => {
            return {
                title: anime.title.english ? anime.title.english : anime.title.romaji,
                description: anime.description,
                coverImage: anime.coverImage,
                genres: this.mapGenres(anime.genres),
                episodesNumber: anime.episodes ? anime.episodes : anime.streamingEpisodes.length,
                score: anime.averageScore
            }
        })
    }

    async getAnimes(animeNumber) {
        try {
            const response = await axios({
                method: this.method,
                url: this.url,
                headers: this.headers,
                data: {
                    query: this.query,
                    variables: { perPage: animeNumber }              
                }
            })

           return response.data.data.Page.media
        }
    
        catch (err) {
            err.response ? console.log(err.response.data.errors) : console.log(err);
        }
    }

    getMediaType(type) {
        switch(type) {
            case 'MOVIE': 
                return 'movie'
            case ('SPECIAL' || 'OVA' || 'ONA'):
                return 'special';
            default: 
                return 'episode';
        }
    }

    getMediaTitle(title) {
        return title.split(' - ')[1] ? title.split(' - ')[1] : title
    }

    mapMedia(animesFromDB, animes) {
        const episodes = [];

        animes.forEach((anime, animeIndex) => {
            anime.streamingEpisodes.forEach((episode, episodeIndex) => {
                const mappedEpisode = {
                    anime: animesFromDB[animeIndex]._id,
                    mediaType: this.getMediaType(anime.format),
                    link: episode.url,
                    season: 1,
                    number: episodeIndex + 1,
                    title: this.getMediaTitle(episode.title),
                    description: 'A description'
                }

                episodes.push(mappedEpisode)
            })
        })

        return episodes;
    }

    async seedDB(animesNumber) {
        const animes = await this.getAnimes(animesNumber);
        const mappedAnimes = this.mapAnimes(animes);

        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    
            await mongoose.connection.dropDatabase();

            const animesFromDB = await Anime.create(mappedAnimes);

            const media = this.mapMedia(animesFromDB, animes);

            await Media.create(media)

            await mongoose.connection.close();
        }

        catch (err) {
            console.log(err)
        }
    }
}

const anilist = new AniListHandler();

anilist.seedDB(50)