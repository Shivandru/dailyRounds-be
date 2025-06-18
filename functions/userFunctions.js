const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

class UserFunctions {
  async createUser({ name, email, password }) {
    try {
      if (!name || !email || !password) {
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const user = await User.findOne({ email });
      if (user) {
        return {
          status: 400,
          json: {
            success: false,
            message: "user already exists",
          },
        };
      }
      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = await User.create({ name, email, password: hash });
      return {
        status: 200,
        json: {
          success: true,
          message: "user created successfully",
          data: newUser,
        },
      };
    } catch (error) {
      console.log(`error occured from user function createUser ${error}`);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }
  async loginUser({ email, password }) {
    try {
      if (!email || !password) {
        return {
          status: 400,
          json: {
            success: false,
            message: "missing required fields",
          },
        };
      }
      const user = await User.findOne({ email });
      if (!user) {
        return {
          status: 400,
          json: {
            success: false,
            message: "user does not exist",
          },
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          status: 400,
          json: {
            success: false,
            message: "invalid credentials",
          },
        };
      }
      const access_token = jwt.sign(
        { email: user.email, userId: user._id },
        accessTokenKey,
        { expiresIn: 40 * 60 }
      );
      const refresh_token = jwt.sign(
        { email: user.email, userId: user._id },
        refreshTokenKey,
        { expiresIn: 60 * 60 }
      );
      return {
        status: 200,
        json: {
          success: true,
          user,
          access_token,
          refresh_token,
        },
      };
    } catch (error) {
      console.log(`error occured from user function loginUser ${error}`);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async getUser({email}){
    try {
      const user = await User.findOne({email});
      if(!user){
        return {
          status: 400,
          json: {
            success: false,
            message: "user does not exist",
          },
        };
      }
      return {
        status: 200,
        json: {
          success: true,
          user,
        },
      };
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

  async getAllUsers() {
    try {
      const users = await User.find();
      return {
        status: 200,
        json: {
          success: true,
          users,
        },
      };
    } catch (error) {
      console.log(`error occured from user function getAllUsers ${error}`);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  // async logoutUser(){
  //   try {
      
  //   } catch (error) {
  //     console.log(`error occured from user function logout ${error}`);
  //     return {
  //       status: 500,
  //       json: {
  //         success: false,
  //         message: "Internal Server Error",
  //       },
  //     };
  //   }
  // }
}

module.exports = UserFunctions;
