"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const feedbackSchema = new mongoose_1.default.Schema({
    Name: {
        type: String,
        required: [true, "Name is Needed"]
    },
    Email: {
        type: String,
        required: [true, "Email is Needed"],
        validate: [validator_1.default.isEmail, "Please Provide a valid email"]
    },
    Subject: {
        type: String,
        required: [true, "Subject is Needed"]
    },
    Content: {
        type: String,
        required: [true, "Content is Needed"]
    },
    Time: {
        type: Date,
        required: [true, "Time is Needed"]
    }
});
exports.Feedback = mongoose_1.default.model("feedback", feedbackSchema);
