class Controller {
    constructor(model) {
        this.Model = model;
    }

    searchById = async id => {
            const foundDoc = await this.Model.findById(id);

            return foundDoc;
    }

    searchByQuery = async (query, options) => {
        const foundDocs = await this.Model.find(query).sort(options);

        return foundDocs;
    }

    getAll = async (req, res, next) => {
        try {
            const docs = await this.Model.find({});

            res.status(200).json({ data: docs });
        }

        catch(err) {
            console.log(err);
        }
    }


    getOne = async (req, res, next) => {
        const { id } = req.params;

        try {
            const foundDoc = await this.searchById(id);

            res.status(200).json({ data: foundDoc })
        }

        catch(err) {
            console.log(err);
        }
    }
}

module.exports = Controller;