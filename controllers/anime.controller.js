const Anime = require("../models/Anime.model");
const Controller = require("./constructor/Controller");
const mediaController = require("./media.controller");
const formatter = require("../utils/formatter.utils");

class AnimeController extends Controller {
  constructor(animeModel) {
    super(animeModel);
  }

  getAllFromGenre = async (req, res, next) => {
    try {
      const { genre } = req.params;
      //genre is expected to be received in hyphanete lowercase, and be stored in Uppercase
      const formattedGenre = formatter.capitalize(genre);

      const foundAnimes = await Anime.find({ genres: formattedGenre });

      res.status(200).json({ data: foundAnimes });
    } catch (err) {
      console.log(err);
    }
  };

  getAnimeAndMedia = async (req, res, next) => {
    const { id } = req.params;

    try {
      const animeSearchResult = await this.Model.findById(id);

      const animeMedia = await mediaController.searchRelations(id);

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
