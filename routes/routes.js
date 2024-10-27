import Validator from "../middleware/validator.middleware.js";
import Controller from "../controller/controller.js";
import jwtAuth from "../middleware/jwt.authenticator.js";

import express from "express";

const router = express.Router();

const controller = new Controller();

router.post(
  "/signup",
  Validator.userSignUpRules(),
  Validator.validate,
  (req, res, next) => {
    controller.signUp(req, res, next);
  }
);
router.post(
  "/signin",
  Validator.userSignInRules(),
  Validator.validate,
  (req, res, next) => {
    controller.signIn(req, res, next);
  }
);

router.get("/userdetails", jwtAuth, (req, res, next) => {
  controller.getDetails(req, res, next);
});

export default router;
