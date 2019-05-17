//引入套件
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bdParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");

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

//session
app.use(session({ secret: "okokok" }));

//handle bars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body-parser
app.use(bdParser.urlencoded({ extended: true }));

//method override
app.use(methodOverride("_method"));

//路由區
app.use("/users", require("./route/user"));
//[首頁路由]-------------------------------------

app.get("/", (req, res) => {
  res.render("index");
});
