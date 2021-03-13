#!/usr/bin/env node
const program = require("commander");
const content2dynamo = require("../lib/content2dynamo");
(async () => {
  try {
    program
      .name("./content2dynamo.js")
      .version("1.0.0")
      .description(
        "Put script metadata transformed from FILE, about scripts " +
          "stored in BUCKET, in TABLE."
      )
      .requiredOption(
        "-t, --table-name <TABLE>, The name of the DynamoDB table " +
          "to put items in, example: -t MyTable123"
      )
      .requiredOption(
        "-b, --bucket-name <BUCKET>, The name of the S3 bucket " +
          "where script JSON is stored, example: -s MyBucket345"
      )
      .requiredOption(
        "-c, --content-file-path <FILE>, The path to a file like " +
          "content.json in this repo with data about scripts to be saved," +
          " example: -c './my-content.json'"
      )
      .parse(process.argv);
    const { tableName, bucketName, contentFilePath } = program.opts();
    console.log(tableName);
    console.log(bucketName);
    console.log(contentFilePath);
    const dbResponse = await content2dynamo(
      tableName,
      bucketName,
      contentFilePath
    );
    console.log("bin/content2dynamo: dbResponse:");
    console.log(dbResponse);
    if (!dbResponse.data) {
      console.log(
        "bin/content2dynamo: batchWriting metadata failed, dbResponse:"
      );
      console.log(dbResponse);
      process.exit(1);
    }
  } catch (err) {
    console.log("bin: error");
    console.log(err);
    process.exit(1);
  }
})();
