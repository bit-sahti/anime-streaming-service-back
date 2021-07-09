class Controller {
    constructor(model) {
        this.Model = model;
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
            const foundDoc = await this.Model.findById(id);

            res.status(200).json({ data: foundDoc })
        }

        catch(err) {
            console.log(err);
        }
    }

    createOne = async doc => {
        try {
            const newDoc = await this.Model.create(doc);

            return newDoc;
        }

        catch(err) {
            console.log(err)
        }
    }
}

module.exports = Controller;