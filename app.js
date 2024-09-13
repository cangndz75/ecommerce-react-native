import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import translations from "./node_modules/adminjs/lib/locale/de/translation.json" assert { type: "json" };
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingInterval: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);
  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server listening at ${PORT}${admin.options.rootPath}`);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("Client connected");
      socket.io("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`Client joined room ${orderId}`);
      });
      socket.io.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  });
};

start();
