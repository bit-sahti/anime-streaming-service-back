const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

beforeAll(async () => await mongoose.connection.dropCollection("users"));

afterAll(async () => {
  await mongoose.connection.close();
});

const testUser = {
    "email": "test@email.com",
    "password": "123456",
  }

describe("POST call on sign up", () => {
  const url = "/api/auth/signup";
  let response, repeatedEmailRes, invalidFieldsRes;

  beforeAll(async () => {
    response = await request(app)
      .post('/api/auth/signup', (err) => console.log(err))
      .send(testUser)

    repeatedEmailRes = await request(app).post(url).send(testUser)

    invalidFieldsRes = await request(app).post(url).send({
        email: 'sdedrtrj',
        password: ''
    });
  });

  it("should create a new resource", () => {
    expect(response.status).toEqual(201);
  });

  it("should return a success message", () => {
    expect(response.body.message).toEqual(expect.any(String));
  });

  it("should return a bad request status if fields are invalid", () => {
    expect(repeatedEmailRes.status && invalidFieldsRes.status).toEqual(400);
  });

  it("should return a direct error message if email", () => {
    expect(repeatedEmailRes.body).toEqual(
      expect.objectContaining({
        error: {
          type: expect.any(String),
          message: expect.any(String),
        },
      })
    );
  });

  it("should an array of errors if fields format is invalid", () => {
    expect(invalidFieldsRes.body).toEqual(
      expect.objectContaining({
        error: {
            type: expect.any(String),
            list: expect.any(Array),
        }
      })
    );
  });

  it("should specify the requirements of each field", () => {
    const checkErrorDetails = (errors) => {
      return errors.every((error) => error.field && error.requirement);
    };

    expect(checkErrorDetails(invalidFieldsRes.body.error.list)).toBeTruthy;
  });
});
