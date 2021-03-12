/* globals jest, expect */
const AWS = require("aws-sdk");
const fs = require("fs");
const mockBatchWrite = jest.fn();
const mockReadFileSync = jest.fn();

describe("content2dynamo", () => {
  beforeEach(() => {
    jest.resetModules();
    mockBatchWrite.mockReset();
    mockReadFileSync.mockReset();
  });
  test("2", async () => {
    const tableName = "myTable";
    const bucketName = "someOtherBucket";
    const expectedParams = {
      RequestItems: {},
    };
    expectedParams.RequestItems[tableName] = [
      {
        PutRequest: {
          Item: {
            haggadah_description:
              "A short script to help you get good at Mad Liberation. Max 12 players.",
            lib_id: "script#0004",
            haggadah_short_desc: "Practice Script",
            room_code: "script#AAAAAD",
            path: `${bucketName}/004-Practice_Script`,
            is_script: 1,
            haggadah_name: "0004 - Practice Script",
            script_number: 4,
          },
        },
      },
    ];

    mockReadFileSync.mockImplementation((path, options) => {
      return `{
        "Items": [
            {
                "haggadah_description": {
                    "S": "A short script to help you get good at Mad Liberation. Max 12 players."
                },
                "lib_id": {
                    "S": "script#0004"
                },
                "haggadah_short_desc": {
                    "S": "Practice Script"
                },
                "room_code": {
                    "S": "script#AAAAAD"
                },
                "path": {
                    "S": "madliberation-scripts/004-Practice_Script"
                },
                "is_script": {
                    "N": "1"
                },
                "haggadah_name": {
                    "S": "0004 - Practice Script"
                },
                "script_number": {
                    "N": "4"
                }
            }
        ],
        "Count": 1,
        "ScannedCount": 1,
        "ConsumedCapacity": null
    }
    `;
    });
    jest.mock("fs", () => {
      return {
        readFileSync: mockReadFileSync,
      };
    });
    mockBatchWrite.mockImplementation((params, cb) => {
      if (
        Array.isArray(params.RequestItems) &&
        params.RequestItems.length === 1 &&
        params.RequestItems[0].haggadah_description ===
          "A short script to help you get good at Mad Liberation. Max 12 players." &&
        params.RequestItems[0].lib_id === "script#0004" &&
        params.RequestItems[0].haggadah_short_desc === "Practice Script" &&
        params.RequestItems[0].room_code === "script#AAAAAD" &&
        params.RequestItems[0].path ===
          "madliberation-scripts/004-Practice_Script" &&
        params.RequestItems[0].is_script === 1 &&
        params.RequestItems[0].haggadah_name === "0004 - Practice Script" &&
        params.RequestItems[0].script_number === 4
      ) {
        cb(false, { data: "someData2" });
      } else {
        cb({ err: "someError" }, false);
      }
    });
    jest.mock("aws-sdk", () => {
      return {
        DynamoDB: {
          DocumentClient: jest.fn(() => {
            return {
              batchWrite: mockBatchWrite,
            };
          }),
        },
      };
    });

    const content2dynamo = require("./content2dynamo");
    const dbResponse = await content2dynamo(
      "sedersXYZ987",
      bucketName,
      "content.txt"
    );
    expect(dbResponse).toEqual({ data: "someData2" });
    expect(mockBatchWrite).toHaveBeenCalledTimes(1);
  });
});
