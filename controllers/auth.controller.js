const User = require('../models/User.model');
const Controller = require('./constructor/Controller');
const passwordManager = require('../utils/bcrypt.utils');
const jwtManager = require('../utils/jwt.utils');

class AuthController extends Controller {
    constructor(userModel) {
        super(userModel)
    }

    signup = async (req, res, next) => {
        console.log('call on sign up')
        try {
            const { username, email, password } = req.body;

            const userFromDB = await this.Model.findOne({ email });

            if (userFromDB) {
                return res.status(400).json({ error: {
                    type: 'Auth',
                    message: 'Email already registered.'
                }})
            }

            const encryptedPassword = passwordManager.encrypt(password)

            const newUser = await this.createOne(
                {
                    username,
                    email,
                    password: encryptedPassword
                }
            );
            
            res.status(201).json({ message: `User sucessfully registered under id ${newUser._id}` })
        }

        catch(err) {
            console.log(err)
        }
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const userFromDB = await this.Model.findOne({ email });

            const isPasswordCorrect = userFromDB ? passwordManager.decrypt(password, userFromDB.password) : false

            if (!userFromDB || !isPasswordCorrect) {
                return res.status(400).json({
                    error: {
                        type: 'Auth',
                        message: 'Incorrect email or password.'
                    }
                })
            }

            const token = jwtManager.generateToken(userFromDB._id)

            res.status(200).json({
                message: {
                    token,
                    //the role should be plain text in order to be read on the front-end
                    role: userFromDB.role
                }
            })
        }

        catch(err) {
            console.log(err)
        }
    }
}

module.exports = new AuthController(User);