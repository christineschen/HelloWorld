exports = async function() {
  const count = await context.services.get("mongodb-atlas").db("test").collection("test").count();
  return {
    response: count
  };
};