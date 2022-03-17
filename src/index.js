import express from "express";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const USERS = [];

const app = express();
const port = 3000;

dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  rules: {
    expiresIn: "1h",
  },
};

const signupSchema = yup.object().shape({
  createdOn: yup.date().default(() => new Date()),
  password: yup
    .string()
    .typeError("password must be a string")
    .required("password is a required field"),
  email: yup
    .string("email must be a string")
    .email("invalid email")
    .required("email is a required field"),
  age: yup
    .number("age must be a number")
    .integer("age must be an integer")
    .positive("age must be a positive value")
    .required("age is a required field"),
  username: yup
    .string("username must be a string")
    .required("username is a required field"),
  uuid: yup.string().default(uuidv4),
});

const loginSchema = yup.object().shape({
  password: yup
    .string("password must be a string")
    .required("password is a required field"),
  username: yup
    .string("username must be a string")
    .required("username is a required field"),
});

const validateSchema = (schema) => async (req, res, next) => {
  await schema
    .validate(req.body)
    .then((validated) => {
      req.data = validated;
      return next();
    })
    .catch((e) => res.status(400).json({ message: e.message.split(", ")[0] }));
};

const verifyAuthentication = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "invalid authorization token" });
      }

      req.decoded = decoded;
    });
  } catch {
    return res.status(401).json({ message: "missing authorization header" });
  }

  return next();
};

const verifyAuthorization = (req, res, next) => {
  const { uuid } = req.params;

  if (req.decoded.uuid !== uuid) {
    return res.status(403).json({ message: "access denied" });
  }

  req.uuid = uuid;
  return next();
};

app.use(express.json());

app.post("/signup", validateSchema(signupSchema), async (req, res) => {
  req.data.password = await bcrypt.hash(req.data.password, 10);

  USERS.push(req.data);

  const { password, ...payload } = req.data;

  return res.status(201).json(payload);
});

app.post("/login", validateSchema(loginSchema), async (req, res) => {
  const user = USERS.find((object) => req.data.username === object.username);

  try {
    if (await bcrypt.compare(req.data.password, user.password)) {
      const token = jwt.sign(user, jwtConfig.secret, jwtConfig.rules);

      return res.status(200).json({ token });
    }
  } catch {
    return res.status(400).json({ message: "invalid credentials" });
  }

  return res.status(400).json({ message: "invalid credentials" });
});

app.get("/users", verifyAuthentication, (_, res) => {
  res.status(200).json(USERS);
});

app.put(
  "/users/password/:uuid",
  verifyAuthentication,
  verifyAuthorization,
  async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);

      USERS.forEach((user) => {
        if (req.uuid === user.uuid) {
          user.password = newPassword;
        }
      });
    } catch {
      return res.status(400).json({ message: "password must be a string" });
    }

    return res.status(204).end();
  }
);

app.listen(port);
