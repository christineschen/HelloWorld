exports = async function() {
  const result = await context.services.get("mongodb-datalake").db("Database0").collection("S3BackedCollection").findOne();
  console.log('Successfully queried s3 datalake', result._id);
};
