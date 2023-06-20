exports = async function() {
  const result = await context.services.get("mongodb-datalake").db("Database0").collection("Collection0").findOne();
  console.log('Successfully queried adl', result._id);
};
