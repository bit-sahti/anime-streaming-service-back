const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

afterAll(() => mongoose.connection.close());

let responseBody, responseStatus;

describe("Get /animes", () => {
  beforeAll(async () => {
    const response = await request(app).get("/api/animes");

    responseBody = response.body;
    responseStatus = response.status;
  });

  it("should be a successfull request", () => {
    expect(responseStatus).toEqual(200);
  });

  it("should return an object with a data property containing an array", () => {
    expect(responseBody).toEqual(
      expect.objectContaining({ data: expect.any(Array) })
    );
  });

  it("should return all documents on DB", () => {
    expect(responseBody.data.length).toEqual(3);
  });
});

describe("Get animes/:genre", () => {
  let genre = "Comédia";

  beforeAll(async () => {
    const response = await request(app).get(
      "/api/animes/" + encodeURIComponent(genre)
    );

    responseBody = response.body;
    responseStatus = response.status;
  });

  it("should be a successfull request", () => {
    expect(responseStatus).toEqual(200);
  });

  it("should return an object with a data property containing an array", () => {
    expect(responseBody).toEqual(
      expect.objectContaining({ data: expect.any(Array) })
    );
  });

  it(`should return all ${genre} animes from the DB`, () => {
    expect(responseBody.data.length).toEqual(2);
  });

  it(`should not return any anime that is not a ${genre}`, () => {
    const matchGenre = responseBody.data.every((anime) =>
      anime.genre.includes(genre)
    );

    expect(matchGenre).toBeTruthy();
  });
});

describe("Get call on animes/:id", () => {
  let sampleAnime, badRequestBody, badRequestStatus;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/animes");

    sampleAnime = body.data[0];

    const response = await request(app).get("/api/animes/" + sampleAnime._id);
    const badRequestRes = await request(app).get("/api/animes/" + "sdfghf");

    responseBody = response.body;
    responseStatus = response.status;

    badRequestBody = badRequestRes.body;
    badRequestStatus = badRequestRes.status;
  });

  it("should be a successfull request", () => {
    expect(responseStatus).toEqual(200);
  });

  it("should have data containing anime and media properties", () => {
    //will arrays pass?
    expect(responseBody).toEqual(
      expect.objectContaining({
        data: {
          anime: expect.any(Object),
          media: {
            episodes: expect.any(Array),
            movies: expect.any(Array),
            specials: expect.any(Array),
          },
        },
      })
    );
  });

  it("should return the anime with the requested id", () => {
    expect(responseBody.data._id).toEqual(sampleAnime._id);
  });

  it("should return a 'not found' status if requested id doesn't exist", () => {
    expect(badRequestStatus).toEqual(404);
  });

  it("should return an error message in it's body if requested id doesn't exist", () => {
    expect(badRequestBody).toEqual(
      expect.objectContaining({
        error: {
          type: expect.any(String),
          message: expect.any(String),
        },
      })
    );
  });
});
