const jwt = require("jsonwebtoken");
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
async function auth(req, res, next) {
  try {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Login Again",
      });
    }
    jwt.verify(accessToken, accessTokenKey, function (err, decoded) {
      if (err) {
        jwt.verify(refreshToken, refreshTokenKey, function (err, decoded) {
          if (decoded) {
            var newToken = jwt.sign(
              {
                userId: decoded.userId,
              },
              accessTokenKey,
              { expiresIn: "1h" }
            );
            res.cookie("accessToken", newToken, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            });
            req.userId = decoded.userId;
            return next();
          } else {
            return {
              status: 400,
              json: {
                success: false,
                message: "Login Again",
              },
            };
          }
        });
      } else if (decoded) {
        req.userId = decoded.userId;
        return next();
      } else {
        return {
          status: 400,
          json: {
            success: false,
            message: "Login Again",
          },
        };
      }
    });
  } catch (error) {
    return {
      status: 500,
      json: {
        success: false,
        message: "Internal Server Error",
      },
    };
  }
}

module.exports = auth;
