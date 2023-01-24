const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");
// const sassMiddleware = require('sass-middleware');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));
//make the uploads path availabe to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
// Extract styles and script from sub pages into the layout

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//session creation middleware
//mongo store is used to store the session cookie in the DB
app.use(
  session({
    name: "code_bar",
    //TODO: change the secret before deployment
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongo-db setup OK");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router

app.use("/", require("./routes"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`); // interpolation
  }
  console.log(`Server is running on port: ${port}`);
});
