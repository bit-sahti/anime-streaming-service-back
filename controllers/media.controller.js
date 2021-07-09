const Media = require('../models/Media.model')
const Controller = require('./constructor/Controller');

class MediaController extends Controller {
    constructor(mediaModel) {
        super(mediaModel)
    }

    searchRelations = async id => {
        const options = { season: 1, number: 1}

        const episodes = await this.Model.find({ mediaType: 'episode', anime: id }, options);
        const movies = await this.Model.find({ mediaType: 'movie', anime: id }, options);
        const specials = await this.Model.find({ mediaType: 'special', anime: id }, options);

        if (!episodes.length && !movies.length && !specials.length) return null;

        return {
            episodes,
            movies,
            specials
        }
    }

    // getRelations = async (req, res, next) => {
    //     const { id } = req.params;

    //     try {
    //         const media = await this.searchRelations(id);

    //         res.status(200).json({ data: media })
    //     } 
    //     catch(err) {
    //         console.log(err)
    //     }
    // }
}

module.exports = new MediaController(Media);