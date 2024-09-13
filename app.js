import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import translations from './node_modules/adminjs/lib/locale/de/translation.json' assert { type: 'json' };
import { registerRoutes } from "./src/routes/index.js";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();

  await registerRoutes(app);
  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server listening at ${PORT}${admin.options.rootPath}`);
    }
  });
};

start();