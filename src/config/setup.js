import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as AdminJSFastify from "@adminjs/fastify";
import * as Models from "../model/index.js";
import { COOKIE_PASSWORD, sessionStore, authenticate } from "./config.js";
import { dark,light,noSidebar } from "@adminjs/themes";
AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phoneF", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Category,
    },
    {
      resource: Models.Product,
    },
  ],

  branding: {
    companyName: "Gündüz App",
    withMadeWithLove: false,
    favicon:"https://res.cloudinary.com/dhe3yon5d/image/upload/v1726168106/rmrwkwel1kw1thidcpv9.png",
    logo:"https://res.cloudinary.com/dhe3yon5d/image/upload/v1726168106/rmrwkwel1kw1thidcpv9.png",
  },
  defaultTheme:dark.id,
  availableThemes: [dark,light,noSidebar],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs",
    },
    app,
    {
      store: sessionStore,
      saveUnintialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
