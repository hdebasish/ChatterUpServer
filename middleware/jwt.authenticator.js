import jsonwebtoken from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.username = payload.username;
    req.imageUrl = payload.imageUrl;
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

export default jwtAuth;
