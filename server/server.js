require("dotenv").config();
require("express-async-errors")
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
// π» Third party middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

// π» DatabaseConnection  βββββββββββββββββββββββββ
const mongoose = require("mongoose");
const { mongoConnection } = require("./config/mongoConnection");
const { logEvents } = require("./middleware/logger");
mongoConnection(); // This excutes the connection
// π» DatabaseConnection  βββββββββββββββββββββββββ

// π» Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());
// π» Cors Options
app.use(cors(corsOptions));

// telling server where to find static files
app.use("/", express.static(path.join(__dirname, "public")));

// π» Define your routes
// δΈζ¬‘δΈη¨apiεηΌοΌ ε δΈΊ serverεclientε¨δΈεport
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));

// Setting Server side response for 404 situation
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// π» Middleware
app.use(errorHandler);

// π» DatabaseConnection  βββββββββββββββββββββββββ
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
// π» DatabaseConnection  βββββββββββββββββββββββββ
