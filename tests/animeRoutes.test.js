const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

const formatter = require("../utils/formatter.utils");

afterAll(() => mongoose.connection.close());

let response;

describe("Get /animes", () => {
  beforeAll(async () => {
    response = await request(app).get("/api/animes")
  });

  it("should be a successfull request", () => {
    expect(response.status).toEqual(200);
  });

  it("should return an object with a data property containing an array", () => {
    expect(response.body).toEqual(
      expect.objectContaining({ data: expect.any(Array) })
    );
  });

  it("should return all documents on DB", () => {
    expect(response.body.data.length).toEqual(6);
  });
});

describe("Get animes/categories/genres", () => {
  let genre = "mahou shoujo";

  beforeAll(async () => response = await request(app).get(
      "/api/animes/categories/" + encodeURIComponent(genre)
    ))

  it("should be a successfull request", () => {
    expect(response.status).toEqual(200);
  });

  it("should return an object with a data property containing an array", () => {
    expect(response.body).toEqual(
      expect.objectContaining({ data: expect.any(Array) })
    );
  });

  it(`should return all ${genre} animes from the DB`, () => {
    expect(response.body.data.length).toEqual(2);
  });

  it(`should not return any anime that is not a ${genre}`, () => {
    const formattedGenre = formatter.capitalize(genre);
    const matchGenre = response.body.data.every((anime) =>
      anime.genres.includes(formattedGenre)
    );

    expect(matchGenre).toBeTruthy();
  });
});

describe("Get call on animes/:id", () => {
  let sampleAnime, unexistingID, badRequest;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/animes");

    sampleAnime = body.data[0];

    response = await request(app).get("/api/animes/" + sampleAnime._id);

    unexistingID = await request(app).get(
      "/api/animes/" + "6082d65fe511f735f5d25ec2"
    );
    badRequest = await request(app).get("/api/animes/" + "sdfghf");
  });

  it("should be a successfull request", () => {
    expect(response.status).toEqual(200);
  });

  it("should have data containing anime and media properties", () => {
    expect(response.body).toEqual(
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
    expect(response.body.data.anima && Array.isArray(response.body.data.anime)).toBeFalsy();
  });

  it("should return the anime with the requested id", () => {
    expect(response.body.data.anime._id).toEqual(sampleAnime._id);
  });

  it("should return null properties if requested id doesn't exist", () => {
    expect(unexistingID.body).toEqual(
      expect.objectContaining({
        data: {
          anime: null,
          media: null,
        },
      })
    );
  });

  it("should return a'bad request' status if :id isn't a string", () => {
    expect(badRequest.status).toEqual(400);
  });

  it("should return an error message in it's body if requested id isn't a string", () => {
    expect(badRequest.body).toEqual(
      expect.objectContaining({
        error: {
          type: expect.any(String),
          message: expect.any(String),
        },
      })
    );
  });
});
