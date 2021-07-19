const mongoose = require("mongoose");
const joi = require('joi');
const joiObjectid = require("joi-objectid");

//it will enable us to validate MongoDB ids
joi.objectId = require('joi-objectid')(joi);

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

    this.listEntrySchema = joi.object()
    .options({ abortEarly: false })
    .keys({
      anime: joi.objectId().required(),
      relation: joi.string().valid('watching', 'watched', 'toWatch').required(),
      isFavorite: joi.boolean()
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

  checkInfo = (schema, info) => {
    const validationErrors = schema.validate(info);

    if (validationErrors.error) {
      return this.mountErrorMessage(validationErrors.error.details);
    }

    return null;
  }

  checkSignUpInfo = (req, res, next) => {
   
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

  checkLoginInfo = (req, res, next) => {
    
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

  checkListInfo = (req, res, next) => {
    const errorMessage = this.checkInfo(this.listEntrySchema, req.body)

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
}

module.exports = new Validator();