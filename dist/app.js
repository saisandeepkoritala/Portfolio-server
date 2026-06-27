"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = require("./Routes/userRoutes");
const kbRouter_1 = require("./Routes/kbRouter");
const agentRouter_1 = require("./Routes/agentRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173",
        "https://saisandeepkoritala-portfolio.netlify.app"]
}));
app.use("/api/v1/user", userRoutes_1.router);
app.use("/api/v1/agent", kbRouter_1.kbRouter);
app.use("/api/v1/askBot", agentRouter_1.agentRouter);
exports.default = app;
