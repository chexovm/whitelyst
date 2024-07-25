function logRequest(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Call the next middleware
}

export default logRequest;
