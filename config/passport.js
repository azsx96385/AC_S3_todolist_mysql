//設定 passport 策略
const db = require("../models");
const User = db.User;
const localStrategy = require("passport-local");
const fbSrategy = require("passport-facebook");
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

  passport.use(
    new fbSrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"]
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        let passwordHash = password => {
          return new Promise((resolve, reject) => {
            bcrytpt.genSalt(10, (err, salt) => {
              bcrytpt.hash(password, salt, (err, hash) => {
                if (err) {
                  return reject("password hash error");
                }
                resolve(hash);
              });
            });
          });
        };
        //驗證email，存在與否，有-登入處理，沒有-新建後登入
        User.findOne({ where: { email: profile._json.email } })
          .then(userdata => {
            if (!userdata) {
              //無使用者-新建用戶
              //亂數密碼
              let randomPassword = Math.random()
                .toString(36)
                .slice(-8);
              //新建會員
              passwordHash(randomPassword)
                .then(hashPassword => {
                  let name = profile._json.name;
                  let email = profile._json.email;
                  let password = hashPassword;
                  newUser = new User({ name, email, password });
                  return newUser.save();
                })
                .then(userdata => {
                  return done(null, userdata);
                })
                .catch(err => {
                  console.log(err);
                });
            } else if (userdata) {
              //有資料-回傳資料
              return done(null, userdata);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    )
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
