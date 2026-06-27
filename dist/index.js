"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./Shared/env");
const DB_URI = env_1.env.DATABASE_URI;
mongoose_1.default.connect(DB_URI, {
    dbName: env_1.env.DATABASE_NAME
})
    .then(() => {
    console.log("Connection is Successful to DB via Mongoose...");
    app_1.default.listen(env_1.env.PORT, () => {
        console.log(`Server Running on port ${env_1.env.PORT}`);
    });
})
    .catch((err) => {
    console.error("Error in connecting to DB...", err);
    process.exit(1);
});
