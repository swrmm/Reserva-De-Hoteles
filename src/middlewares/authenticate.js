const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      code: "AUTH_REQUIRED",
      message: "Debes iniciar sesion para usar este recurso"
    });
  }

  try {
    const token = authHeader.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "La sesion no es valida o expiro"
    });
  }
}

module.exports = authenticate;
