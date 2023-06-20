exports = async function() {
  const updatedDocument = await context.services.get("ServerlessInstance0").db("test").collection("test").findOneAndUpdate({}, {"$inc": {"i": 1}}, {upsert: true, returnNewDocument: true});
  console.log('Successfully incremented i to', updatedDocument.i);
};
