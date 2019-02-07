//DEPENDENCIES
const express = require("express");
app = express();
mongoose = require("mongoose");
bodyParser = require("body-parser");
passport = require("passport");
path = require("path");

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

//PORT OR DEV ENVIRONMENT
const port = process.env.PORT || 3000;

//DB CONFIG
const db = require("./config/keys").mongoURI;

//DB CONNECTION
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//USE ROUTES
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server static assets if in production

if (process.env.NODE_ENV === "production") {
  // SET A STATIC FOLDER
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//PASSPORT Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

//SERVER INITIALIZATION
app.listen(process.env.PORT || port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`The Server Running on Port ${port}`);
  }
});
