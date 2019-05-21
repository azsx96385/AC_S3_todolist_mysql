module.exports = {
  Authenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect("/users/login");
    } else {
      return next();
    }
  }
};
