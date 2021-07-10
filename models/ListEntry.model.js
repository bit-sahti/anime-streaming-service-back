const { Schema, model, Types } = require('mongoose');

const ListEntrySchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    anime: { type: Types.ObjectId, ref: 'Anime', required: true },
    relation: { type: String, enum: ['watching', 'watched', 'toWatch'], required: true },
    isFavorite: { type: Boolean, default: false } 
})

const ListEntry = new model('List-entry', ListEntrySchema);

module.exports = ListEntry;