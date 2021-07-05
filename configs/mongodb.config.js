const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
  .then(() => console.log('Successfully connected to the database'))
  .catch(e => console.log(e))