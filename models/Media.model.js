const { Schema, Types, model} = require('mongoose');

const MediaSchema = new Schema({
    anime: { type: Types.ObjectId, ref: 'Anime', required: true },
    mediaType: { type: String, enum: ['episode', 'movie', 'special'], required: true},
    link: { type: String, required: true },
    season: { type: Number, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
},
{
    timestamps: true
}
)

const Media = new model('Media', MediaSchema);

module.exports = Media;