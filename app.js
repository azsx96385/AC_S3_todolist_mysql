//引入套件
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bdParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");

//設定套件

//express
const app = express();
app.listen(process.env.PORT || 3000, () => {
  console.log("server connected");
});

//session
app.use(session({ key: "okokok" }));

//handle bars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view egine", "handlebars");

//body-parser
app.use(bdParser.urlencoded({ extended: true }));

//method override
app.use(methodOverride("_method"));

//路由區
