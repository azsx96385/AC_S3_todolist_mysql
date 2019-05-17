//設定 passport 策略
const db = require("../models");
const User = db.User;
const localStrategy = require("passport-local");
const bcrytpt = require("bcryptjs");

module.exports = passport => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //驗證資料是否有漏填
      if (!email || !password) {
        console.log("系統訊息|資料漏填");
        done(null, false, { message: "系統訊息|資料漏填" });
      }

      User.findOne({ where: { email: email } }).then(data => {
        if (!data) {
          console.log("系統訊息|用戶尚未註冊");
          return done(null, false, { message: "系統訊息|用戶尚未註冊" });
        } else {
          //比對密碼是否一致
          bcrytpt.compare(password, data.password, (err, isMatch) => {
            if (isMatch) {
              return done(null, data);
            } else {
              console.log("系統訊息|密碼錯誤");
              return done(null, false, { message: "系統訊息|密碼錯誤" });
            }
          });
        }
      });
    })
  );

  //----session 正反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      done(null, user);
    });
  });
};
