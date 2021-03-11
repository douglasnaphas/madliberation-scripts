/* globals jest, expect */
const AWS = require("aws-sdk");
const mockUpdate = jest.fn();

describe("content2dynamo", () => {
  beforeEach(() => {
    jest.resetModules();
    mockUpdate.mockReset();
  });
  test("1", async (done) => {
    mockUpdate.mockImplementation((params, cb) => {
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
    expect(dbResponse).toEqual({ data: "someData" });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
  test("2", async (done) => {
    mockUpdate.mockImplementation((params, cb) => {
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
    expect(dbResponse).toEqual({ data: "someData" });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});
