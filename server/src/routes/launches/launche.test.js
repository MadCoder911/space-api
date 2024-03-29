const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.mode");
describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS",
      rocket: "uss",
      target: "uss",
      launchDate: "January 4, 2030",
    };
    const launchDataWithoutDate = {
      mission: "USS",
      rocket: "uss",
      target: "uss",
    };
    // test("It should respond with 201 success", async () => {
    //   const response = await request(app)
    //     .post("/v1/launches")
    //     .send(completeLaunchData)
    //     .expect(201);
    //   expect(response.body).toMatchObject(launchDataWithoutDate);

    //   const reqDate = new Date(completeLaunchData.launchDate).valueOf();
    //   const responseDate = new Date(response.body.launchDate).valueOf();
    //   expect(responseDate).toBe(reqDate);
    // });
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It should catch missing required dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "USS",
          rocket: "uss",
          target: "uss",
          launchDate: "zoot",
        })
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid Date",
      });
    });
  });
});
