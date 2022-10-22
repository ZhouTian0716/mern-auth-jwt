const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
// Third party middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

// 👻 Middleware
app.use(logger);
app.use(express.json());
app.use(cookieParser());
// 👻 Cors Options
app.use(cors(corsOptions));

// telling server where to find static files
app.use("/", express.static(path.join(__dirname, "public")));

// Define your routes
app.use("/", require("./routes/root"));

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

// 👻 Middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
