const mongoose = require("mongoose");
const joi = require('joi');

class Validator {
  constructor() {
    this.signUpSchema = joi.object()
      .options( { abortEarly: false })
      .keys({        
        username: joi.string().trim().min(3).max(30).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().trim().min(6).required()
      });

    this.loginSchema = joi.object()
    .options( { abortEarly: false })
    .keys({
      email: joi.string().trim().email().required(),
      password: joi.string().trim().min(6).required()
    });
      
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

  checkInfo = (schema, info) => {
    const validationErrors = schema.validate(info);

    if (validationErrors.error) {
      return this.mountErrorMessage(validationErrors.error.details);
    }

    return null;
  }

  checkSignUpInfo = async (req, res, next) => {
    try {
      const errorMessage = this.checkInfo(this.signUpSchema, req.body)

      if (errorMessage) {
        return res.status(400).json({
          error: {
            type: 'Validation',
            list: errorMessage
          }
        })
      }

      return next();
    }

    catch(err) {
      console.log(err);
    }
  }

  checkLoginInfo = async (req, res, next) => {
    try {
      const errorMessage = this.checkInfo(this.loginSchema, req.body)

      if (errorMessage) {
        return res.status(400).json({
          error: {
            type: 'Validation',
            list: errorMessage
          }
        })
      }

      next();
    }

    catch(err) {
      console.log(err);
    }
  }
}

module.exports = new Validator();