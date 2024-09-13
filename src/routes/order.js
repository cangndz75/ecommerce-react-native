import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = (fastify, options) => {
  fastify.addHook("preHandler", async (request, reply) => {
    const isAuthanticated = await verifyToken(request, reply);
    if (!isAuthanticated) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
  fastify.post("/order", createOrder);
  fastify.get("/order", getOrders);
  fastify.patch("/order/:orderId/status", updateOrderStatus);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.post("/order/:orderId", getOrderById);
};
