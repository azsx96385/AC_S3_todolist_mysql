const router = require("express").Router();
const db = require("../models");
const Todo = db.Todo;
const User = db.Todo;

//[create]==============================
router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", (req, res) => {
  let { name, UserId } = req.body;
  let newtodo = new Todo({ name, UserId });
  console.log(req.body);
  newtodo
    .save()
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});
//[detail]==============================
router.get("/detail/:id", (req, res) => {
  User.findByPk(req.user.id)
    .then(userdata => {
      if (!userdata) throw new Error("user not found");
      return Todo.findOne({
        where: { id: req.params.id, UserId: req.user.id }
      });
    })
    .then(todo => {
      res.render("detail", {
        todoId: todo.id,
        todoName: todo.name,
        todoDone: todo.done,
        todoUpdated: todo.updatedAt
      });
    });
});

//[edit]==============================
router.get("/edit/:id", (req, res) => {
  User.findByPk(req.user.id)
    .then(userdata => {
      if (!userdata) throw new Error("user not found");
      return Todo.findOne({
        where: { id: req.params.id, UserId: req.user.id }
      });
    })
    .then(todo => {
      res.render("edit", {
        todoId: todo.id,
        todoName: todo.name,
        todoDone: todo.done,
        todoUpdated: todo.updatedAt
      });
      console.log(todo.done, "todo.done,");
    });
});
router.post("/edit/:id", (req, res) => {
  User.findByPk(req.user.id)
    .then(userdata => {
      if (!userdata) throw new Error("user not found");
      return Todo.findOne({
        where: { id: req.params.id, UserId: req.user.id }
      });
    })
    .then(todo => {
      todo.name = req.body.name;
      todo.done = req.body.done === "on";
      return todo.save();
    })
    .then(todo => {
      return res.redirect("/");
    })
    .catch(err => {
      return res.status(422).json(err);
    });
});

//[delete]==============================
router.get("/delete/:id", (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");

      return Todo.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      });
    })
    .then(todo => {
      return res.redirect("/");
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});
module.exports = router;
