/* globals jest, expect */
const AWS = require("aws-sdk");

describe("content2dynamo", () => {
  beforeEach(() => {
    jest.resetModules();
    // mockUpdate.mockReset();
  });
  test("...", async (done) => {
    // expect(content2dynamo("./test-data/content1.json"));

    const mockUpdate = jest.fn((params, cb) => {
      console.log("in mockUpdate");
      cb(false, { data: "someData" });
      done();
    });
    jest.mock("aws-sdk", () => {
      return {
        DynamoDB: {
          DocumentClient: jest.fn(() => {
            return {
              update: mockUpdate,
            };
          }),
        },
      };
    });
    const content2dynamo = require("./content2dynamo");
    const dbResponse = await content2dynamo();
    console.log(dbResponse);
    expect(dbResponse).toEqual({ data: "someData" });
  });
});
