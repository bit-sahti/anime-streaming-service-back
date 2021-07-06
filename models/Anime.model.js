const { Schema, Types, model } = require('mongoose');

const AnimeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: [String], enum: []},
    episodesNumber: { type: Number, required: true},
    audio: {
        type: [ String ],
        default: ['Japonês']
    },
    subtitles: {
        type: [ String ],
        default: ['Português']
    },
    score: { type: Number }
},
{
    timestamps: true
}
)

const Anime = new model('Anime', AnimeSchema);

module.exports = Anime;