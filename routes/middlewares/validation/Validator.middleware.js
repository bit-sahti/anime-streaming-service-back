const mongoose = require("mongoose")
class Validator {
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
  };
}

module.exports = new Validator();