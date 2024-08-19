import express from "express";
import authController from "../../controller/authController.js";
import { STATUS_CODES } from "./../../utils/statusCodes.js";
import User from "../../models/User.js";
import handleError from "../../utils/handleError.js";

const router = express.Router();

function checkLoginRequestPayload(data) {
  if (!data?.email || !data?.password) {
    return false;
  }
  return true;
}

function checkRegisterRequestPayload(data) {
  if (!data?.name || !data?.email || !data?.password) {
    return false;
  }
  return true;
}

// localhost:5000/api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const isValid = checkRegisterRequestPayload(req.body);

    if (!isValid) {
      throw handleError("The signup request is invalid");
    }

    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(STATUS_CODES.conflict).json({
        status: "error",
        code: STATUS_CODES.conflict,
        message: "Email is already in use",
        data: "Conflict",
      });
    }

    const newUser = await authController.signup({ name, email, password });

    res
      .status(STATUS_CODES.success)
      .json({ message: "User was created succesfully", data: newUser });
  } catch (error) {
    res
      .status(STATUS_CODES.badRequest)
      .json({ message: "There was an error to the validation library" });
  }
});

// localhost:5000/api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const isValid = checkLoginRequestPayload(req.body);

    if (!isValid) {
      throw handleError("The login request is invalid");
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS_CODES.badRequest).json({
        status: "Error",
        code: STATUS_CODES.badRequest,
        message: "Email or password is not correct",
        data: "Conflict",
      });
    }

    const token = await authController.login({ email, password });
    res.status(STATUS_CODES.success).json({
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res
      .status(STATUS_CODES.badRequest)
      .json({ message: "Email or password is wrong", error: error });
  }
});

// localhost:5000/api/auth/user
router.get("/user", authController.validateAuth, async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header) {
      throw handleError("Authorization requierd");
    }

    const token = header.split(" ")[1];
    const payload = await authController.getPayloadFromJwt(token);
    const user = await User.findOne({ email: payload.data.email });
    res.status(STATUS_CODES.success).json({
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});

// // localhost:5000/api/auth/logout
router.get("/logout", authController.validateAuth, async (req, res, next) => {
  try {
    const header = req.get("authorization");
    if (!header) {
      throw handleError("Authorization required");
    }

    const token = header.split(" ")[1];
    const payload = await authController.getPayloadFromJwt(token);

    await User.findOneAndUpdate({ email: payload.data.email }, { token: null });
    res.status(STATUS_CODES.noContent).send();
  } catch (error) {
    throw handleError(`The request could not be fullfield: ${error}`);
  }
});

export default router;
