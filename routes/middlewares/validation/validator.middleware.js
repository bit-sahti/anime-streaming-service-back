const mongoose = require("mongoose");
const joi = require('joi');

class Validator {
  constructor() {
    this.authSchema = joi.object()
      .options( { abortEarly: false })
      .keys({ 
        email: joi.string().trim().email().required(),
        password: joi.string().trim().min(6).required()
      })
  }

  checkRequestedId = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: {
          type: "Format",
          message: "Invalid ID format.",
        },
      });
    }

    return next();    
  }

  mountErrorMessage = errorList => {
    return errorList.map((error) => {
      return {
        field: error.context.key,
        requirement: error.message,
      }; 
    });
  }

  checkAuthInfo = async(req, res, next) => {
    const validationErrors = this.authSchema.validate(req.body);

    if (validationErrors.error) {
      const errorMessage = this.mountErrorMessage(validationErrors.error.details);

      return res.status(400).json({
        error: {
          type: 'Validation',
          list: errorMessage
        }
      })
    }

    next();

  }
}

module.exports = new Validator();