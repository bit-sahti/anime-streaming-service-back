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

    createOne = async (req, res, next) => {
        try {
            const newDoc = await this.Model.create(req.body);

            return res.status(201).json({
                data: doc
            })
        }

        catch(err) {
            console.log(err)
        }
    }

    updateOne = async (req, res, next) => {
        try {
            const { id } = req.params;

            const updatedDoc = await this.Model.findByIdAndUpdate(id, req.body, { new: true })

            return res.status(200).json({
                data: updatedDoc
            })
        }

        catch(err) {
            console.log(err)
        }
    }

    deleteOne = async (req, res, next) => {
        try {
            const { id } = req.params;

            await this.Model.findByIdAndDelete(id);

            return res.status(204).json({});
        }

        catch(err) {
            console.log(err)
        }
    }
}

module.exports = Controller;