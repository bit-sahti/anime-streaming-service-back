const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

const Formatter = require("../utils/Formatter.utils");

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
    expect(responseBody.data.length).toEqual(6);
  });
});

describe("Get animes/categories/genres", () => {
  let genre = "mahou shoujo";

  beforeAll(async () => {
    const response = await request(app).get(
      "/api/animes/categories/" + encodeURIComponent(genre)
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
    const formattedGenre = Formatter.capitalize(genre);
    const matchGenre = responseBody.data.every((anime) =>
      anime.genres.includes(formattedGenre)
    );

    expect(matchGenre).toBeTruthy();
  });
});

describe("Get call on animes/:id", () => {
  let sampleAnime, unexistingIdReqBody, badRequestBody, badRequestStatus;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/animes");

    sampleAnime = body.data[0];

    const response = await request(app).get("/api/animes/" + sampleAnime._id);
    const unexistingIDRes = await request(app).get(
      "/api/animes/" + "6082d65fe511f735f5d25ec2"
    );
    const badRequestRes = await request(app).get("/api/animes/" + "sdfghf");

    responseBody = response.body;
    responseStatus = response.status;

    unexistingIdReqBody = unexistingIDRes.body;

    badRequestBody = badRequestRes.body;
    badRequestStatus = badRequestRes.status;
  });

  it("should be a successfull request", () => {
    expect(responseStatus).toEqual(200);
  });

  it("should have data containing anime and media properties", () => {
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

  it("should only return one anime", () => {
    expect(Array.isArray(responseBody.data.anime)).toBeFalsy();
  });

  it("should return the anime with the requested id", () => {
    expect(responseBody.data.anime._id).toEqual(sampleAnime._id);
  });

  it("should return null properties if requested id doesn't exist", () => {
    expect(unexistingIdReqBody).toEqual(
      expect.objectContaining({
        data: {
          anime: null,
          media: null,
        },
      })
    );
  });

  it("should return a'bad request' status if :id isn't a string", () => {
    expect(badRequestStatus).toEqual(400);
  });

  it("should return an error message in it's body if requested id isn't a string", () => {
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
