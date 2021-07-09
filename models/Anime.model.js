const { Schema, Types, model } = require('mongoose');

const AnimeSchema = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    genres: { type: [String], required: true},
    episodesNumber: { type: Number, required: true},
    audio: {
        type: [ String ],
        default: ['Japonês'],
        required: true
    },
    subtitles: {
        type: [ String ],
        default: ['Português'],
        required: true
    },
    score: { type: Number, required: true }
},
{
    timestamps: true
}
)

const Anime = new model('Anime', AnimeSchema);

module.exports = Anime;