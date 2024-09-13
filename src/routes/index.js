import { authRoutes } from "./auth.js";

const prefix = "/api";

export const registerRoutes = async (fastify, options) => {
  fastify.register(authRoutes, { prefix: prefix });
};
