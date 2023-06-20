exports = async function() {
  await context.services.get("mongodb-atlas").db("test").collection("test").updateOne({}, {"$inc": {"i": 1}}, {upsert: true});
};
