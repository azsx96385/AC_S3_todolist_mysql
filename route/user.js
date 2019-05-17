//會員系統使用路由

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;

//[註冊登入路由]-------------------------------------

//註冊====================================
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  //註冊之表單資料
  let { name, email, password, password_confirm } = req.body;
  //驗證-漏填資料+密碼一致+已註冊過
  if (!name || !email || !password || !password_confirm) {
    console.log("系統訊息| 資料漏填");
    res.render("register", { name, email, password, password_confirm });
  }
  if (password !== password_confirm) {
    console.log("系統訊息| 密碼不一直");
    res.render("register", { name, email, password, password_confirm });
  }
  User.findOne({ where: { email: email } }).then(data => {
    if (data) {
      console.log("系統訊息| 已是會員");
      res.render("login", { email });
    } else {
      //密碼加密
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          password = hash;
          //新增使用者
          const newUser = new User({ name, email, password });
          newUser
            .save()
            .then(user => res.redirect("/"))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//登入====================================
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res) => {});

//登出====================================
router.get("/logout", (req, res) => {});

module.exports = router;
