const express = require("express");
const UserFunctions = require("../functions/userFunctions");

const userRouter = express.Router();
const userFunctions = new UserFunctions();

userRouter.post("/register", async (req, res) => {
  try {
    const { status, json } = await userFunctions.createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { status, json } = await userFunctions.loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    res.cookie("accessToken", json.access_token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", json.refresh_token, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(status).send({
      success: true,
      user: json.user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.get("/user", async (req, res) => {
  try {
    const { status, json } = await userFunctions.getUser({
      email: req.query.email,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.get("/allUsers", async (req, res) => {
  try {
    const { status, json } = await userFunctions.getAllUsers();
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.get("/logout", (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send({
      success: true,
      message: "Logged out successfully",
    });
});


module.exports = userRouter;
