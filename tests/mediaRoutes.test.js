const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

afterAll(() => mongoose.connection.close());

let response;

describe("Get /media", () => {
  beforeAll(async () => {
    response = await request(app).get("/api/media");
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
    expect(response.body.data.length).toEqual(18);
  });
});

describe("Get call on media/:id", () => {
  let sampleMedia, unexistingIdRes, badRequestRes;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/media");

    sampleMedia = body.data[0];

    response = await request(app).get("/api/media/" + sampleMedia._id);

    unexistingIdRes = await request(app).get(
      "/api/media/" + "6082d65fe511f735f5d25ec2"
    );

    badRequestRes = await request(app).get("/api/media/" + "sdfghf");
  });

  it("should be a successfull request", () => {
    expect(response.status).toEqual(200);
  });

  it("should have a data property containing a single object", () => {
    expect(response.body.data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        anime: expect.any(String),
        mediaType: expect.any(String),
        link: expect.any(String),
        season: expect.any(Number),
        number: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        __v: expect.any(Number),
      })
    );
  });

  it("should return the media with the requested id", () => {
    expect(response.body.data._id).toEqual(sampleMedia._id);
  });

  it("should return null if requested id doesn't exist", () => {
    expect(unexistingIdRes.body.data).toEqual(null);
  });

  it("should return a'bad request' status if :id isn't a string", () => {
    expect(badRequestRes.status).toEqual(400);
  });

  it("should return an error message in it's body if requested id isn't a string", () => {
    expect(badRequestRes.body).toEqual(
      expect.objectContaining({
        error: {
          type: expect.any(String),
          message: expect.any(String),
        },
      })
    );
  });
});
