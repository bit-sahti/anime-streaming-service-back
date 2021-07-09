const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

const Formatter = require("../utils/Formatter.utils");

afterAll(() => mongoose.connection.close());

let responseBody, responseStatus;

describe("Get /media", () => {
  beforeAll(async () => {
    const response = await request(app).get("/api/media");

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
    expect(responseBody.data.length).toEqual(18);
  });
});

describe("Get call on media/:id", () => {
  let sampleMedia, unexistingIdReqBody, badRequestBody, badRequestStatus;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/media");

    sampleMedia = body.data[0];

    const response = await request(app).get("/api/media/" + sampleMedia._id);
    const unexistingIDRes = await request(app).get(
      "/api/media/" + "6082d65fe511f735f5d25ec2"
    );
    const badRequestRes = await request(app).get("/api/media/" + "sdfghf");

    responseBody = response.body;
    responseStatus = response.status;

    unexistingIdReqBody = unexistingIDRes.body;

    badRequestBody = badRequestRes.body;
    badRequestStatus = badRequestRes.status;
  });

  it("should be a successfull request", () => {
    expect(responseStatus).toEqual(200);
  });

  it("should have a data property containing a single object", () => {
    expect(responseBody).toEqual(
      expect.objectContaining({
        data: {
            _id: expect.any(String),
            anime: expect.any(String),
            mediaType: expect.any(String),
            link: expect.any(String),
            season: expect.any(Number),
            number: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            __v: expect.any(Number)
        }
      })
    );
  });

  it("should return the media with the requested id", () => {
    expect(responseBody.data._id).toEqual(sampleMedia._id);
  });

  it("should return null if requested id doesn't exist", () => {
    expect(unexistingIdReqBody.data).toEqual(null);
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
