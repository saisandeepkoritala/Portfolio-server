"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const EnvSchema = zod_1.z.object({
    DATABASE_URI: zod_1.z.string(),
    DATABASE_NAME: zod_1.z.string(),
    PORT: zod_1.z.string().default("5000").transform((value) => Number(value)),
    OPENAI_API_KEY: zod_1.z.string().min(1, 'Api key missing')
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.log('Loading env error....');
    process.exit(1);
}
exports.env = Object.freeze(parsed.data);
