const AWS = require("aws-sdk");
const content2dynamo = async (tableName, contentFile) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const params = {
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

  console.log(AWS);

  const dbResponse = await new Promise((resolve, reject) => {
    dynamodb.update(params, (err, data) => {
      if (err) {
        resolve({ madliberation_error: err });
      } else {
        resolve(data);
      }
    });
  });
  return dbResponse;
  // return "xx";
};
module.exports = content2dynamo;
