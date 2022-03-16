import express from "express";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

let database = [];

const app = express();
const port = 3000;

const userSchema = yup.object().shape({
  createdOn: yup.date().default(() => new Date()),
  password: yup
    .string("password must be a string")
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

const validateSchema = (schema) => (req, res, next) => {
  schema
    .validate(req.body)
    .then((validated) => {
      req.validated = validated;
      return next();
    })
    .catch((e) => res.status(400).json({ message: e.errors.join(", ") }));
};

app.use(express.json());

app.listen(port);
