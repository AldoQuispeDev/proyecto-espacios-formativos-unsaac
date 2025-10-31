import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


// Importar rutas
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import matriculasRoutes from "./routes/matriculas.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";

const app = express();

// Middleware general
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Rutas
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/matriculas", matriculasRoutes);
app.use("/api", catalogosRoutes);

// Ruta de prueba
app.get("/api/health", (_, res) => res.json({ ok: true }));

export default app;
