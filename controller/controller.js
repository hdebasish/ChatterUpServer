import Model from "../model/model.js";
import Repository from "../repository/repository.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
export default class Controller {
  constructor() {
    this.repository = new Repository();
  }

  async signUp(req, res, next) {
    try {
      const { username, email, password, gender } = req.body;

      const foundUser = await this.repository.findByUsername(username);

      if (foundUser) {
        return res.status(409).json("Username already exists");
      }

      const rand = Math.floor(Math.random() * (12 - 1 + 1)) + 1;

      let avatar = "";

      if (gender == "male") {
        avatar = `/media/images/avatars/Male/${rand}.jpg`;
      } else {
        avatar = `/media/images/avatars/Female/${rand}.jpg`;
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new Model(
        username,
        email,
        hashedPassword,
        gender,
        avatar,
        false
      );

      const result = await this.repository.add(user);

      if (result) {
        const token = jsonwebtoken.sign(
          { username: username, imageUrl: avatar },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );

        return res.status(201).send(token);
      } else {
        return res.status(500).send("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { username, password } = req.body;

      const foundUser = await this.repository.findByUsername(username);

      if (!foundUser) {
        return res.status(400).send("User not found");
      }

      const validate = await bcrypt.compare(password, foundUser.password);

      if (validate) {
        const token = jsonwebtoken.sign(
          { username: username, imageUrl: foundUser.avatar },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );

        return res.status(201).send(token);
      } else {
        return res.status(401).send("Invalid Username or Password");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getDetails(req, res, next) {
    try {
      const username = req.username;
      const image = req.imageUrl;

      const userInfo = {
        username: username,
        image: image,
      };
      return res.json(userInfo);
    } catch (error) {
      console.log(error);
    }
  }
}
