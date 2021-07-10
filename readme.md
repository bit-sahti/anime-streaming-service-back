# Anime strreaming API

This project was developted as for a challenge, which consisted in simulating a product API that we loved. Since I love anime, that's what I went with.

## Tecnologies

- Node & Express
- MongoDB & Mongoose
- Jest
- JWT
- Bcrypt
- Joi

## Setup
In order to run this project, you need to define some enviroment variables:

- PORT
- MONGO_URI
- JWT_HASH_SECRET
- JWT_EXPIRATION_TIME

You'll also need to mock the database, since I unfornutetly didn't have the time to build it. For that, please run ```node seeds/seed.js``` from the root folder before running the tests or using the endpoints.

Also, please note that the tests are set to run on a disposable local database, and will destroy some of the collections each turn. Do not run than on a real database.

## Endpoints
All endpoints start from ```/api```, and are divided into anime, media, auth and user(lists) endpoints.
#### Animes
```GET animes/ ``` recovers all anime documents from the DB
```GET animes/categories/:genre ``` recovers all documents from a particular genre. It expects to receive the genre parameter as a hyphenated strin ('slice-of-life') or as plain text ('slice of life')
```GET animes/:id ``` returns the anime with given id from the database, as long as the related media.
#### Media
```GET media/``` returns all the media documents from the database
```GET media/:id ``` return the media document with the given id from the database.
#### Auth
```POST auth/signup``` expects to receive an object with `username`, `email` and `password` and registrates them as a normal user
```POST auth/login``` expects to receive an object with `email` and `password` and checks them against the data on the DB. If they are correct, it returns a `token` to be used as a `authorization header` on requests to the protected routes.

#### User lists
This routes accept only logged users, and so must be accessed with the help of a HTTP agent like Postman. You must: 
- Register as a user
- Log in with the registered credentials
- Use the returned token as an Authorization Token header

```GET users/:id/lists``` recovers all lists registered under the user who holds the given id.
```POST users/:id/lists``` expects to receive an object with te following properties: `anime` as anime id, `relation` as 'watching', 'watched' or 'toWatch', and the optional `isFavorite` as a boolean.
```GET users/:id/listName``` recovers all the documents from a specific list of the user.
```PUT users/entry/:id``` updates the list entry with the given id and returns it.
```DELETE users/entry/:id/``` deletes the list entry with the given id from the database.

#### Needed improvements
The code still lacks handling of server errors, and there are logs that need to be cleaned. The tests also need to be set to run on a separate dababase.

There is also space for routes for creation and edition of animes and media, which should be protected by admin rights, and for better queries, specially on the anime routes.