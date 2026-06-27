"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: [true, "Need question"]
    },
    answer: {
        type: String,
        required: [true, "Need answer"]
    },
    threadId: {
        type: String,
        required: [true, "Threadid needed"]
    },
    Time: {
        type: Date,
        required: [true, "Time is Needed"]
    }
});
exports.Chat = mongoose_1.default.model("chat", chatSchema);
