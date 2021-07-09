const app = require('./index');

app.listen(process.env.PORT, () => console.log(`App listening on PORT ${process.env.PORT}`))