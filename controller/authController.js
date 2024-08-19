import handleError from "../utils/handleError.js";
import User from "./../models/User.js";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const secretForToken = process.env.TOKEN_SECRET;

// Signup
async function signup(data) {
  const saltRounds = 10;

  try {
    let encryptedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User({
      name: data.name,
      password: encryptedPassword,
      email: data.email,
    });
    return User.create(newUser);
  } catch (error) {
    next(error);
  }
}

// Login
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw handleError("The username does not exist");
  }

  const isMatching = await bcrypt.compare(password, user.password);

  if (isMatching) {
    const token = jwt.sign(
      {
        data: user,
      },
      secretForToken,
      {
        expiresIn: "1h",
      }
    );
    await User.findOneAndUpdate({ email: email }, { token: token });
    return token;
  } else {
    throw handleError("Email or password is wrong");
  }
}

// Get payload from token
async function getPayloadFromJwt(token) {
  try {
    const payload = jwt.verify(token, secretForToken);
    return payload;
  } catch (error) {
    next(error);
  }
}

// Validate auth
function validateAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(STATUS_CODES.unauthorized).json({
        status: "Error",
        code: STATUS_CODES.unauthorized,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
}

const authController = {
  signup,
  login,
  getPayloadFromJwt,
  validateAuth,
};

export default authController;
