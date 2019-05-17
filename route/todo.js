const router = require("express").Router();
const db = require("../models");
const todo = db.Todo;

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", (req, res) => {
  let { name, user_id } = req.body;
  let newtodo = new todo({ name, user_id });
  console.log(newtodo);
  newtodo
    .save()
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
