/* globals jest, expect */
const AWS = require("aws-sdk");
const mockUpdate = jest.fn();

describe("content2dynamo", () => {
  beforeEach(() => {
    jest.resetModules();
    mockUpdate.mockReset();
  });
  test("1", async () => {
    mockUpdate.mockImplementation((params, cb) => {
      cb(false, { data: "someData" });
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
  test("2", async (/*done*/) => {
    const expectedParams = {
      ExpressionAttributeNames: {
        "#P": "participants",
      },
      ExpressionAttributeValues: {
        // ":p": dynamodb.createSet(["myGameName"]),
        ":mc": 1615472844544,
      },
      Key: {
        room_code: "myRoomCode",
        lib_id: "000",
      },
      ReturnValues: "UPDATED_OLD", // use UPDATED_OLD, and look for the name
      // we added. If it's there, fail: the name
      // was taken. If it's not, we need to update
      // the table with this name's session key
      TableName: "myTable",
      UpdateExpression: "ADD #P :p",
      ConditionExpression:
        "attribute_exists(room_code) AND attribute_exists(created) AND " +
        "created > :mc",
    };
    mockUpdate.mockImplementation((params, cb) => {
      if (params.UpdateExpression == expectedParams.UpdateExpression) {
        cb(false, { data: "someData" });
      } else {
        cb({ err: "someError" }, false);
      }
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
