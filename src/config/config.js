import "dotenv/config";
import fastifySession from "@fastify/session";
import connectMongodbSession from "connect-mongodb-session";
import { Admin } from "../model/index.js";

const MongoDBStore = connectMongodbSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const user = await Admin.findOne({
      email,
    });
    if (!user.password === password) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }
  return null;
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
