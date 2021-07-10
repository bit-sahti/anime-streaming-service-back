const jwtManager = require('../../../utils/jwt.utils');

class Protector {
    userExclusive = async (req, res, next) => {
        //the only requirement to pass is to be logged, so we don't need to check for role
        try {
            const token = req.get('Authorization');
            
            if(!token) {
                return res.status(401).json({
                    error: {
                        type: 'Auth',
                        message: 'Only logged users allowed.'
                    }
                })
            }
            
            const userId = jwtManager.verifyToken(token);

            req.user = userId;

            next();
        }

        catch(err) {
            res.status(401).json({
                error: {
                    type: 'Auth',
                    message: 'Invalid authorization token.'
                }
            })
        }
    }
}

module.exports = new Protector();