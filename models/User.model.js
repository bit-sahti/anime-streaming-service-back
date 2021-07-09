const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, 
{
    timestamps: true
}
)

const User = new model('User', UserSchema);

module.exports = User;