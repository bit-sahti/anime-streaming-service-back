const ListEntry = require("../models/ListEntry.model");
const Controller = require("./constructor/Controller");

class ListController extends Controller {
  constructor(listModel) {
    super(listModel);
  }

  searchList = async (userId, relation) => {
    const list = await this.Model.find({ user: userId, relation })
      .populate("user", "username")
      .populate("anime", "title");

    return list;
  };

  getAllFromUser = async (req, res, next) => {
    try {
      const { id: userId } = req.params;

      const watching = await this.searchList(userId, "watching");
      const watched = await this.searchList(userId, "watched");
      const toWatch = await this.searchList(userId, "toWatch");

      return res.status(200).json({
        data: {
          watching,
          watched,
          toWatch,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  getList = async (req, res, next) => {
    const { id: userId, listName } = req.params;

    const list = await this.searchList(userId, listName);

    return res.status(200).json({
      data: list,
    });
  };

  createEntry = async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const { anime, relation, isFavorite } = req.body;
  
      if (userId !== req.user) {
        return res.status(401).json({
          error: {
            type: 'Auth',
            message: 'Users can only modify their own lists.'
          }
        })
      }
  
      const existingEntry = await this.Model.find({ user: userId, anime })
  
      if (existingEntry.length) {
        return res.status(400).json({
          type: 'Duplication',
          message: 'There is already an entry for this anime.'
        })
      }
  
      const reqEntry = {
        user: userId,
        anime,
        relation
      }
  
      if (isFavorite) reqEntry.isFavorite = isFavorite;
  
      const newEntry = await this.Model.create(reqEntry);
  
      return res.status(201).json({ data: newEntry })
    }

    catch(err) {
      console.log(err)
    }
  }
}

module.exports = new ListController(ListEntry);
