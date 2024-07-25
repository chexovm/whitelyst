function checkAuth(req, res, next) {
  req.session && req.session.passport && req.session.passport.user
    ? next()
    : res
        .status(401)
        .json({ error: "Unauthorized: Please login through Discord first." });
}

export default checkAuth;
