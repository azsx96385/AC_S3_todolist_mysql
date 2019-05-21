//引入套件
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bdParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("connect-flash");

// 載入 model
const db = require("./models");
const Todo = db.Todo;
const User = db.User;

//設定套件

//express
const app = express();
app.listen(process.env.PORT || 3000, () => {
  db.sequelize.sync();
  console.log("App is running");
});

//.env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//session
app.use(
  session({ secret: "okokok", resave: "false", saveUninitialized: "false" })
);

//handle bars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body-parser
app.use(bdParser.urlencoded({ extended: true }));

//method override
app.use(methodOverride("_method"));

//passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

//flash
app.use(flash());
//自建中介曾
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.error = req.error;
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.successMessage = req.flash("successMessage");
  next();
});

// //debug 中介曾
// app.use((req, res, next) => {
//   // if (req) {
//   //   console.log("req", Date.now());
//   // }
//   if (res) {
//     console.log("res", res);
//   }

//   next();
// });

//路由區
app.use("/", require("./route/home"));
app.use("/users", require("./route/user"));
app.use("/auth", require("./route/auth"));
app.use("/todos", require("./route/todo"));
