const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

const testUser = {
    username: 'test',
    email: 'test@email.com',
    password: '123456'
}

const listName = 'watching'

let token, userId, animes, response, listEntry, baseUrl;

beforeAll(async () => {
    await mongoose.connection.dropCollection('users');
    await mongoose.connection.dropCollection('list-entries');

    const signUpResponse = await request(app).post('/api/auth/signup').send(testUser);
    userId = signUpResponse.body.message.split(' ')[5];
    baseUrl = `/api/users/${userId}`
    
    const animesResponse = await request(app).get('/api/animes/');
    animes = animesResponse.body.data;

    const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password
    });

    token = loginResponse.body.message.token;

    response = await request(app).post(baseUrl + '/lists').send({
        anime: animes[0]._id,
        relation: `${listName}`
    }).set('Authorization', `Bearer: ${token}`)

    listEntry = response.body.data;
})

afterAll(() => mongoose.connection.close());

describe('POST call on user/:id/lists', () => {
    let repeatedEntryRes, unloggedRes, differentUserRes;

    beforeAll(async () => {
        repeatedEntryRes = await request(app).post(baseUrl + '/lists').send({
            anime: animes[0]._id,
            relation: 'watching'
        }).set('Authorization', `Bearer: ${token}`)

        differentUserRes = await request(app).post('/api/users/60e8f4d013fe2875cdd0c633/lists').send({
            anime: animes[1]._id,
            relation: 'watching'
        }).set('Authorization', `Bearer: ${token}`);

        unloggedRes = await await request(app).post('/api/users/60e8f4d013fe2875cdd0c633/lists').send({
            anime: animes[2]._id,
            relation: 'watching'
        })
        
    })

    it("should return a 'created' status", () => {
        expect(response.status).toEqual(201)
    })

    it('should return the created document', () => {
        expect(response.body.data).toEqual(expect.objectContaining(
            {
                _id: expect.any(String),
                user: expect.any(String),
                anime: expect.any(String),
                relation: expect.any(String),
                isFavorite: expect.any(Boolean)
            }
        ))
    })

    it('should not allow more than one entry per anime', () => {
        expect(repeatedEntryRes.status).toEqual(400)
    })

    it('should not allow unlogged users to post', () => {
        expect(unloggedRes.status).toEqual(401)
    })

    it('should not allow users to post on other users lists', () => {
        expect(differentUserRes.status).toEqual(401)
    })

    it('should return a message in case of errors', () => {
        expect(repeatedEntryRes.body && unloggedRes.body && differentUserRes.body)
            .toEqual(expect.objectContaining({
                error: {
                    type: expect.any(String),
                    message: expect.any(String),
                }
            }))
    })
})

describe('GET call on user/:id/lists', () => {
    beforeAll(async () => {
        response = await request(app).get(baseUrl + '/lists').set('Authorization', `Bearer: ${token}`);
    })

    it('should return a success status', () => {
        expect(response.status).toEqual(200)
    })

    it('should return an array of lists', () => {
        expect(response.body.data).toEqual(expect.objectContaining({
            watching: expect.any(Array),
            watched: expect.any(Array),
            toWatch: expect.any(Array),
        }))
    })
})

describe('GET call on user/:id/:listName', () => {
    beforeAll(async () => {
        response = await request(app).get(baseUrl + `/${listName}`).set('Authorization', `Bearer: ${token}`);
    })

    it('should return a succes status', () => {
        expect(response.status).toEqual(200)
    })

    it('should return an array', () => {
        expect(Array.isArray(response.body.data)).toBeTruthy;
    })

    it("should not have any entry with another listName", () => {
        const checkListNames = (list, name) => {
            return list.every(entry => entry.relation === name)
        }

        expect(checkListNames(response.body.data, listName)).toBeTruthy();
    })
})

describe('PUT call on user/entry/:id', () => {
    beforeAll(async () => {
        response = await request(app).put(`/api/users/entry/${listEntry._id}`).send({
            anime: animes[0]._id,
            relation: listName,
            isFavorite: !listEntry.isFavorite
        }).set('Authorization', `Bearer: ${token}`);
    })

    it('should return a success status', () => {
        expect(response.status).toEqual(200)
    })

    it('should modify the original document', () => {
        expect(response.body.data.isFavorite).not.toBe(listEntry.isFavorite)
    })

    it('should keep the original id', () => {
        expect(response.body.data._id).toEqual(listEntry._id)
    })
})

describe('DELETE call on user/entry/:id', () => {
    
    it('should return a "no content" status', async () => {
        response = await request(app).delete(`/api/users/entry/${listEntry._id}`).set('Authorization', `Bearer: ${token}`);
        expect(response.status).toEqual(204)
    })
})