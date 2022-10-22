const mongoose = require("mongoose");

const mongoConnection = async () => {
  const ProjectDbName = "techNotes";
  const dbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASSWORD}@cluster0.oomzs.mongodb.net/${ProjectDbName}?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(dbUrl);
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoConnection;