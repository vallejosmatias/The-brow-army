import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import hbs from "./config/hbs.js";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

import userRouter from "./routes/userRouter.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { __dirname } from "./utils.js";
import viewsRoutes from "./routes/viewsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import discountCodeRoutes from "./routes/discountCodeRoutes.js";
import paypalRoutes from './routes/paypalRoutes.js';
import serviciosRoutes from './routes/serviciosRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/The-Brow-Army";

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// Middleware global para establecer res.locals.user
app.use(async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      res.locals.user = req.user;
    } catch (error) {
      console.error("Token verification failed:", error);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Mercado Pago

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

app.post("/create_preference", async (req, res) => {
  try {
    const items = req.body.items.map((item) => ({
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      currency_id: "ARS",
    }));

    const subtotal = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
    const discount = req.body.discount || 0;
    const total = subtotal - discount;

    const preferenceData = {
      items,
      back_urls: {
        success: "http://localhost:3000/profile",
        failure: "http://localhost:3000/api/my-cart",
        pending: "http://localhost:3000/api/my-cart",
      },
      auto_return: "approved",
      additional_info: `Total: ${total}`,
      total_amount: total,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia",
    });
  }
});

// conccion a db
mongoose
  .connect(DB_URL, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// middleware handlebars
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// rutas
app.use("/api/users", userRouter);
app.use("/api", protectedRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/", serviciosRoutes);
app.use("/", viewsRoutes);
app.use("/", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/api", discountCodeRoutes);
app.use('/api/paypal', paypalRoutes);

const server = app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));



