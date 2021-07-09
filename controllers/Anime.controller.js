const Anime = require("../models/Anime.model");
const Controller = require("./constructor/Controller");
const MediaController = require("./Media.controller");
const Formatter = require("../utils/Formatter.utils");

class AnimeController extends Controller {
  constructor(animeModel) {
    super(animeModel);
  }

  getAllFromGenre = async (req, res, next) => {
    try {
      const { genre } = req.params;
      //genre is expected to be received in hyphanete lowercase, and be stored in Uppercase
      const formattedGenre = Formatter.capitalize(genre);

      const foundAnimes = await Anime.find({ genres: formattedGenre });

      res.status(200).json({ data: foundAnimes });
    } catch (err) {
      console.log(err);
    }
  };

  getAnimeAndMedia = async (req, res, next) => {
    const { id } = req.params;

    try {
      const animeSearchResult = await this.searchById(id);

      const animeMedia = await MediaController.searchRelations(id);

      res.status(200).json({
        data: {
          anime: animeSearchResult,
          media: animeMedia,
        },
      });
    } catch (err) {
      console.log(err)
    }
  };
}

module.exports = new AnimeController(Anime);
