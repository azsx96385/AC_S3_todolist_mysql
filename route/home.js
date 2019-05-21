//首頁路由
const router = require("express").Router();
const db = require("../models");
const Todo = db.Todo;
const User = db.User;

router.get("/", (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");

      return Todo.findAll({
        where: { UserId: req.user.id }
      });
    })
    .then(todos => {
      console.log("有調到資料");
      return res.render("index", { todos: todos });
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

module.exports = router;
