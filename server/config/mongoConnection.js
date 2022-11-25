const mongoose = require("mongoose");

const ProjectDbName = "techNotes";
const DbUser = process.env.MONGO_USER;

const mongoConnection = async () => {
  const dbUrl = `mongodb+srv://${DbUser}:${process.env.MONGO_USER_PASSWORD}@cluster0.oomzs.mongodb.net/${ProjectDbName}?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `Hello ${DbUser} Mongo Database Name is: ${ProjectDbName}`
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = { mongoConnection };
